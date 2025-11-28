import z from 'zod';
import { definition } from './define-word';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { VERCEL_OIDC_TOKEN, AWS_ROLE_ARN } from '$env/static/private';
import { GetCommand, PutCommand, QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import type { User, Word, WordBase, WordIndex } from './types';

const tableName = 'dictdex';

let client: DynamoDBClient | null = null;
export function getClient() {
  process.env.VERCEL_OIDC_TOKEN = VERCEL_OIDC_TOKEN;
  process.env.AWS_ROLE_ARN = AWS_ROLE_ARN;

  client ??= new DynamoDBClient({
    region: 'eu-central-1',
    credentials: awsCredentialsProvider({
      roleArn: process.env.AWS_ROLE_ARN!,
    }),
  });

  return client;
}

export async function createUser(user: User): Promise<User> {
  await getClient().send(
    new PutCommand({
      TableName: tableName,
      Item: user,
    })
  );

  return user;
}

export async function getUser(username: string): Promise<null | User> {
  const result = await getClient().send(
    new GetCommand({
      TableName: tableName,
      Key: {
        hk: `user#${username}`,
        sk: username,
      }
    })
  );

  if (result.Item) return result.Item as User;
  return null;
}

export async function getWords({
  after,
  containing
}: {
  after?: string | null;
  containing?: string | null;
} = {}) {
  const list: Word[] = [];

  let lastKey: Record<string, unknown> | undefined;
  if (after) {
    lastKey = JSON.parse(atob(after));
  }

  const names = { '#hk': 'hk' };
  const values = { ':hk': 'wordList' };

  if (containing) {
    Reflect.set(names, '#normalizedWord', 'normalizedWord');
    Reflect.set(values, ':containing', containing);
  }

  const limit = 50;

  do {
    const result = await getClient().send(
      new QueryCommand({
        Limit: limit,
        TableName: tableName,
        KeyConditionExpression: '#hk = :hk',
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ExclusiveStartKey: lastKey,
        FilterExpression: containing ? 'contains(#normalizedWord, :containing) OR #normalizedWord = :containing' : undefined,
        ScanIndexForward: false,
      })
    );

    lastKey = result.LastEvaluatedKey;
    list.push(...result.Items as Word[]);
    if (list.length >= limit) break;
  } while (lastKey)

  return { list, moreAfter: lastKey ? btoa(JSON.stringify(lastKey)) : null };
}

export async function getWord(word: string): Promise<Word | null> {
  const result = await getClient().send(
    new GetCommand({
      TableName: tableName,
      Key: {
        hk: 'word',
        sk: word.toLocaleLowerCase(),
      },
    })
  );

  if (result.Item) return result.Item as Word;
  return null;
}

export async function saveWord(
  def: z.infer<typeof definition> & {
    createdAt?: number;
    updatedAt?: number;
  }
) {
  const normalizedWord = def.word.toLocaleLowerCase();

  const base: WordBase = {
    word: def.word,
    normalizedWord,
    description: def.description,
    types: def.types,
    examples: def.examples,
    language: def.language,
    informal: def.informal,
    createdAt: def.createdAt || Date.now(),
    updatedAt: def.updatedAt || Date.now(),
  };

  const word: Word = {
    ...base,
    hk: 'wordList',
    sk: new Date(base.createdAt).toISOString(),
  };

  const wordIndex: WordIndex = {
    ...base,
    hk: 'word',
    sk: word.normalizedWord,
  };

  await getClient().send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: tableName,
            Item: word,
          },
        },
        {
          Put: {
            TableName: tableName,
            Item: wordIndex,
          },
        }
      ],
    })
  );

  await getClient().send(
    new PutCommand({
      TableName: tableName,
      Item: word,
    })
  );

  return word;
}

export async function deleteWord(word: string) {
  const item = await getWord(word);
  if (!item) return;

  const wordIndex: Pick<WordIndex, 'hk' | 'sk'> = {
    hk: 'word',
    sk: item.normalizedWord,
  };

  await getClient().send(
    new TransactWriteCommand({
      TransactItems: [
        {
          Delete: {
            TableName: tableName,
            Key: {
              hk: item.hk,
              sk: item.sk,
            },
          },
        },
        {
          Delete: {
            TableName: tableName,
            Key: {
              hk: wordIndex.hk,
              sk: wordIndex.sk,
            },
          },
        },
      ]
    })
  );
}

