const usersPerPage: number = 25;
const apiEndpoint = process.env.LC_API_URL as string;

const getUserContestBadge = async (username: string) => {
  const graphqlQuery = `
    query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      contestBadge {
        name
        expired
      }
    }
  } 
  `;

  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query: graphqlQuery }),
  });

  const data = await response.json();

  if (data.matchedUser.contestBadge == null) return null;
  if (data.matchedUser.expired) return null;

  return data.matchedUser.contestBadge;
};

const getUserInfo = async (pageData: any, userRank: number): Promise<any> => {
  const userList = pageData.data.globalRanking.rankingNodes;

  for (const userData of userList) {
    if (userData.currentGlobalRanking == userRank) {
      return {
        username: userData.user.username,
        userRating: userData.currentRating,
      };
    }
  }
  throw new Error(
    `Failed to find User with Rank : ${userRank} in pageData ${pageData}`
  );
};

const getPage = async (pageIndex: number): Promise<any> => {
  try {
    const totalParticipants = await getTotalParticipantsCount();
    console.log(totalParticipants);

    const graphqlQuery = `
        query globalRanking {
        globalRanking(page: ${pageIndex}) {
          totalUsers
          userPerPage
          rankingNodes {
            currentRating
            currentGlobalRanking
            dataRegion
            user {
              username
            }
          }
        }
      }
      `;

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    const responseData = await response.json();
    const userList = responseData.data.globalRanking.rankingNodes;
    return userList;
  } catch (error: any) {
    console.error(`Failed to Fetch page With Index ${pageIndex}`);
    throw error;
  }
};

const getTotalParticipantsCount = async (): Promise<number> => {
  const graphqlQuery = `
    query globalRanking {
      globalRanking(page: 2) {
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

export { getTotalParticipantsCount, getPage, getUserInfo, getUserContestBadge };
