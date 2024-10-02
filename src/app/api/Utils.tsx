const usersPerPage = 25;
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

  const variables = {
    username,
  };

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables,
      }),
    });

    console.log(`Fetching Data for username: ${username}`);

    const data = await response.json();

    if (!data || !data.data || !data.data.matchedUser) {
      console.error('No matched user found');
      return null;
    }

    const badge = data.data.matchedUser.contestBadge;

    if (!badge || badge.expired) {
      return null;
    }

    console.log(`${username} has badge of ${badge.name}`);
    return badge.name;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const getUserInfo = async (userRank: number) => {
  const pageIndex = Math.ceil(userRank / usersPerPage);
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

  const pageData = await response.json();

  const userList = pageData.data.globalRanking.rankingNodes;

  for (const userData of userList) {
    if (userData.currentGlobalRanking == userRank) {
      const userBadge = await getUserContestBadge(userData.user.username);
      return {
        username: userData.user.username,
        userRating: userData.currentRating,
        userBadge,
        userGlobalRanking: userData.currentGlobalRanking,
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

const getUserContestBadgeByRank = async (userRank: number) => {
  const { username } = await getUserInfo(userRank);
  console.log(username);
  const badge = await getUserContestBadge(username);
  return badge;
};

const getLowestRatedGuardianUserInfo = async () => {
  console.log(`Searching For Lowest Rated Guardian.`);
  let lowRank = 1;
  let highRank = await getTotalParticipantsCount();

  let bestUsername = '';
  let bestRating = null;
  let bestGlobalRanking = null;

  while (lowRank <= highRank) {
    const midRank = Math.floor((lowRank + highRank) / 2);
    const { username, userBadge, userRating, userGlobalRanking } =
      await getUserInfo(midRank);

    console.log(midRank);

    if (userBadge == 'Guardian') {
      bestUsername = username;
      bestRating = userRating;
      lowRank = midRank + 1;
      bestGlobalRanking = userGlobalRanking;
    } else {
      highRank = midRank - 1;
    }
  }
  const data = {
    username: bestUsername,
    userRating: bestRating,
    userGlobalRanking: bestGlobalRanking,
  };

  return data;
};

const getLowestRatedKnightUserInfo = async () => {
  console.log(`Searching For Lowest Rated Knight.`);
  let lowRank = 1;
  let highRank = await getTotalParticipantsCount();

  let bestUsername = '';
  let bestRating = null;
  let bestGlobalRanking = null;

  while (lowRank <= highRank) {
    const midRank = Math.floor((lowRank + highRank) / 2);
    const { username, userBadge, userRating, userGlobalRanking } =
      await getUserInfo(midRank);

    console.log(midRank);

    if (userBadge == 'Knight' || userBadge == 'Guardian') {
      bestUsername = username;
      bestRating = userRating;
      lowRank = midRank + 1;
      bestGlobalRanking = userGlobalRanking;
    } else {
      highRank = midRank - 1;
    }
  }

  const data = {
    username: bestUsername,
    userRating: bestRating,
    userGlobalRanking: bestGlobalRanking,
  };

  return data;
};

function getCurrentUTCTime() {
  const now = new Date();
  const utcHours = String(now.getUTCHours()).padStart(2, '0');
  const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
  const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');

  const utcTimeString = `${utcHours}:${utcMinutes}:${utcSeconds} UTC`;
  return utcTimeString;
}

export {
  getCurrentUTCTime,
  getLowestRatedGuardianUserInfo,
  getLowestRatedKnightUserInfo,
  getPage,
  getTotalParticipantsCount,
  getUserContestBadge,
  getUserContestBadgeByRank,
  getUserInfo,
};
