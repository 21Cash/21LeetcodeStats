import {
  getLowestRatedGuardianUserInfo,
  getLowestRatedKnightUserInfo,
} from '@/app/api/Utils';

export const revalidate = 900;

let lastFetched: string | undefined;

async function fetchData() {
  const guardianInfo = await getLowestRatedGuardianUserInfo();
  const knightInfo = await getLowestRatedKnightUserInfo();

  if (!lastFetched) {
    lastFetched = new Date().toUTCString();
  }

  return { guardianInfo, knightInfo, lastFetched };
}

export default async function MainPage() {
  const { guardianInfo, knightInfo, lastFetched } = await fetchData();

  const lastUpdatedDate = new Date(lastFetched)
    .toISOString()
    .replace(/[-:]/g, '')
    .split('.')[0];

  return (
    <main className='relative min-h-screen bg-dark text-white'>
      <header className='absolute top-0 left-0 w-full flex justify-center mt-20'>
        <h1 className='text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-green-400 to-sky-400 text-transparent bg-clip-text drop-shadow-lg'>
          21LeetcodeStats
        </h1>
      </header>

      <section className='flex items-center justify-center min-h-screen'>
        <div className='flex justify-center gap-36 w-full max-w-6xl'>
          <div className='flex flex-col items-center bg-gray-800 p-10 rounded-lg shadow-lg w-6/12 hover:shadow-2xl transition-shadow duration-300 ease-in-out ring-2 ring-blue-500'>
            <img
              src='/Guardian.gif'
              alt='Guardian'
              className='w-40 h-40 mb-4'
            />
            <h3 className='text-lg font-semibold'>Lowest Rated Guardian:</h3>
            <a
              href={`https://leetcode.com/${guardianInfo.username}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-base text-blue-400 hover:underline mt-2'
            >
              {guardianInfo.username}
            </a>
            <p className='text-base mt-2'>
              Rating: {parseFloat(guardianInfo.userRating).toFixed(2)}
            </p>
            <p className='text-base mt-2'>
              Global Ranking: {guardianInfo.userGlobalRanking}
            </p>
            <p className='text-sm mt-2'>
              Last Updated:
              <a
                href={`https://www.timeanddate.com/worldclock/fixedtime.html?iso=${lastUpdatedDate}&ah=5&am=0&msg=Guardian%20Last%20Updated`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:underline ml-1'
              >
                {lastFetched}
              </a>
            </p>
          </div>

          <div className='flex flex-col items-center bg-gray-800 p-10 rounded-lg shadow-lg w-6/12 hover:shadow-2xl transition-shadow duration-300 ease-in-out ring-2 ring-green-500'>
            <img src='/Knight.gif' alt='Knight' className='w-40 h-40 mb-4' />
            <h3 className='text-lg font-semibold'>Lowest Rated Knight:</h3>
            <a
              href={`https://leetcode.com/${knightInfo.username}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-base text-blue-400 hover:underline mt-2'
            >
              {knightInfo.username}
            </a>
            <p className='text-base mt-2'>
              Rating: {parseFloat(knightInfo.userRating).toFixed(2)}
            </p>
            <p className='text-base mt-2'>
              Global Ranking: {knightInfo.userGlobalRanking}
            </p>
            <p className='text-sm mt-2'>
              Last Updated:
              <a
                href={`https://www.timeanddate.com/worldclock/fixedtime.html?iso=${lastUpdatedDate}&ah=5&am=0&msg=Knight%20Last%20Updated`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:underline ml-1'
              >
                {lastFetched}
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer className='absolute bottom-0 left-0 w-full py-6 text-center'>
        <p className='text-sm'>
          Made by{' '}
          <a
            href='https://github.com/21Cash'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 hover:underline'
          >
            21Cash
          </a>
        </p>
        <a
          href='https://github.com/21Cash/21LeetcodeStats'
          target='_blank'
          rel='noopener noreferrer'
          className='text-sm text-blue-400 hover:underline'
        >
          Link to GitHub Source Code
        </a>
      </footer>
    </main>
  );
}
