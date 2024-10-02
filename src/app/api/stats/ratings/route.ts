import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const apiEndpoint = process.env.LC_API_URL as string;

const getTotalParticipantsCount = async (): Promise<number> => {
  const graphqlQuery = `
    query globalRanking {
      globalRanking(page: 1) {
        totalUsers
      }
    }
  `;

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global ranking: ${response.status}`);
    }

    const data = await response.json();
    const totalParticipants: number = data.data.globalRanking.totalUsers;

    return totalParticipants;
  } catch (error) {
    console.error('Error fetching total participants count:', error);
    throw error;
  }
};

export async function GET(req: NextRequest) {
  const graphqlQuery = {
    operationName: 'globalRanking',
    query: `
      query globalRanking {
        globalRanking {
          ranking
          data {
            user {
              username
              ranking
              profile {
                realName
                country
              }
            }
            ranking
          }
        }
      }
    `,
    variables: {},
  };

  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global ranking: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
