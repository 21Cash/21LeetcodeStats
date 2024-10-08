import { writeFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { requestToBodyStream } from 'next/dist/server/body-streams';
import { number } from 'zod';

const apiEndpoint = process.env.LC_API_URL as string;

const getUserRating = async (username) => {
  const graphqlQuery = `
    query userContestRankingInfo($username: String!) {
      userContestRanking(username: $username) {
        rating
      }
    }
  `;

  const variables = { username };

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

    // console.log(`Fetching Rating Data for username: ${username}`);

    const data = await response.json();
    // console.log(`Fetched Rating Data:`, data);

    if (data.errors && data.errors.length > 0) {
      console.error(`Error fetching user rating: ${data.errors[0].message}`);
      return null;
    }

    if (!data || !data.data || !data.data.userContestRanking) {
      console.error('No user contest ranking found');
      return null;
    }

    const rating = data.data.userContestRanking.rating;

    // console.log(`${username} has a rating of ${rating}`);

    return rating;
  } catch (error) {
    console.error('Error fetching rating data:', error);
    return null;
  }
};

const getUserContestBadge = async (username) => {
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

    // console.log(`Fetching Data for username: ${username}`);

    const data = await response.json();
    if (!data || !data.data || !data.data.matchedUser) {
      console.error('No matched user found');
      return null;
    }

    const badge = data.data.matchedUser.contestBadge;

    // Check if the badge is expired
    if (!badge || badge.expired) {
      return { badgeName: null, rating: null };
    }

    const rating = await getUserRating(username);
    // console.log(
    //   `${username} has a badge of ${badge.name} and a rating of ${rating}`
    // );

    return {
      badgeName: badge.name,
      rating,
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
// console.log(`Page Index : ${pageIndex}`);

const getClistPageIndex = (rank: number) => {
  if (rank >= 1 && rank <= 10) return 1;
  const pageIndex = Math.ceil((rank - 10) / 50) + 1;
  return pageIndex;
};

const getUsernameByRank = async (userRank) => {
  const pageIndex = getClistPageIndex(userRank);
  const apiUrl = `https://clist.by/resource/leetcode.com/?country=&period=all&top_page=${pageIndex}&querystring_key=top_page`;

  try {
    const response = await fetch(apiUrl);
    const html = await response.text();

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const rows = document.querySelectorAll('tr');

    for (const row of rows) {
      const rankElement = row.querySelector('td:nth-child(1)');
      const usernameElement = row.querySelector('.inline-button a');

      if (rankElement && usernameElement) {
        const rank = parseInt(rankElement.textContent.trim(), 10);
        const username = usernameElement.href.split('/u/')[1].split('/')[0];

        if (rank === userRank) {
          return username;
        }
      }
    }

    throw new Error(`Username not found for rank ${userRank}`);
  } catch (error) {
    console.error('Error fetching or processing data:', error);
    throw error;
  }
};

const getUserInfo = async (userRank) => {
  // console.log(`Fetching Info For User with rank: ${userRank}`);

  try {
    const username = await getUsernameByRank(userRank);
    // console.log(`Username with Rank :${userRank} : ${username}`);

    const { badgeName, rating } = await getUserContestBadge(username);

    return {
      username,
      userRating: rating,
      userBadge: badgeName,
      userGlobalRanking: userRank,
    };
  } catch (error) {
    console.error(error.message);
    throw new Error(`Failed to find user with rank: ${userRank}`);
  }
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

const getLowestRatedGuardianUserInfo = async () => {
  // console.log(`Searching For Lowest Rated Guardian.`);
  let lowRank = 1;
  let highRank = await getTotalParticipantsCount();

  let bestUsername = '';
  let bestRating = null;
  let bestGlobalRanking = null;

  while (lowRank <= highRank) {
    const midRank = Math.floor((lowRank + highRank) / 2);

    try {
      const { username, userBadge, userRating, userGlobalRanking } =
        await getUserInfo(midRank);

      // console.log(midRank);

      if (userBadge === 'Guardian') {
        bestUsername = username;
        bestRating = userRating;
        lowRank = midRank + 1;
        bestGlobalRanking = userGlobalRanking;
      } else {
        highRank = midRank - 1;
      }
    } catch (error) {
      console.error(
        `Error fetching user info for rank ${midRank}: ${error.message}`
      );
      highRank--;
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
  // console.log(`Searching For Lowest Rated Knight.`);
  let lowRank = 1;
  let highRank = await getTotalParticipantsCount();

  let bestUsername = '';
  let bestRating = null;
  let bestGlobalRanking = null;

  while (lowRank <= highRank) {
    const midRank = Math.floor((lowRank + highRank) / 2);

    try {
      const { username, userBadge, userRating, userGlobalRanking } =
        await getUserInfo(midRank);

      // console.log(midRank);

      if (userBadge === 'Knight' || userBadge === 'Guardian') {
        bestUsername = username;
        bestRating = userRating;
        lowRank = midRank + 1;
        bestGlobalRanking = userGlobalRanking;
      } else {
        highRank = midRank - 1;
      }
    } catch (error) {
      console.error(
        `Error fetching user info for rank ${midRank}: ${error.message}`
      );
      highRank--;
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
  getUserInfo,
  getUsernameByRank,
  getUserRating,
};
