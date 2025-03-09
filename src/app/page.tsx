export default async function MainPage() {
  const guardianInfoResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/guardian-stats`,
    {
      next: { revalidate: 900 },
    }
  );
  const knightInfoResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/knight-stats`,
    {
      next: { revalidate: 900 },
    }
  );

  const guardianInfo = await guardianInfoResponse.json();
  const knightInfo = await knightInfoResponse.json();

  const guardianLastUpdatedTimestamp = guardianInfo.lastUpdated;
  const guardianLastUpdatedDate = guardianLastUpdatedTimestamp
    ? new Date(
        guardianLastUpdatedTimestamp.seconds * 1000 +
          guardianLastUpdatedTimestamp.nanoseconds / 1000000
      )
    : null;

  const knightLastUpdatedTimestamp = knightInfo.lastUpdated;
  const knightLastUpdatedDate = knightLastUpdatedTimestamp
    ? new Date(
        knightLastUpdatedTimestamp.seconds * 1000 +
          knightLastUpdatedTimestamp.nanoseconds / 1000000
      )
    : null;

  const guardianLastUpdatedISO = guardianLastUpdatedDate
    ? guardianLastUpdatedDate.toISOString()
    : '';
  const guardianLastUpdatedUTC = guardianLastUpdatedDate
    ? guardianLastUpdatedDate.toUTCString()
    : 'N/A';

  const knightLastUpdatedISO = knightLastUpdatedDate
    ? knightLastUpdatedDate.toISOString()
    : '';
  const knightLastUpdatedUTC = knightLastUpdatedDate
    ? knightLastUpdatedDate.toUTCString()
    : 'N/A';

  return (
    <main className='flex flex-col min-h-screen bg-dark text-white'>
      <header className='w-full pt-16 flex justify-center'>
        <h1 className='text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-green-400 to-sky-400 text-transparent bg-clip-text drop-shadow-lg'>
          21LeetcodeStats
        </h1>
      </header>

      <section className='flex-grow flex items-center justify-center px-4 py-8'>
        <div className='flex flex-col md:flex-row gap-8 md:gap-12 w-full max-w-6xl'>
          {/* Guardian Info Card */}
          <div className='flex flex-col items-center bg-gray-800 p-6 md:p-10 rounded-lg shadow-lg w-full md:w-1/2 hover:shadow-2xl transition-shadow duration-300 ease-in-out ring-2 ring-blue-500'>
            <img
              src='/Guardian.gif'
              alt='Guardian'
              className='w-32 h-32 md:w-40 md:h-40 mb-4'
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
              Rating: {Number.parseFloat(guardianInfo.userRating).toFixed(2)}
            </p>
            <p className='text-base mt-2'>
              Global Ranking: {guardianInfo.userGlobalRanking}
            </p>
            <p className='text-sm mt-2'>
              Last Updated:
              <a
                href={`https://www.timeanddate.com/worldclock/fixedtime.html?iso=${guardianLastUpdatedISO}&msg=Guardian%20Last%20Updated`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:underline ml-1'
              >
                {guardianLastUpdatedUTC}
              </a>
            </p>
          </div>

          {/* Knight Info Card */}
          <div className='flex flex-col items-center bg-gray-800 p-6 md:p-10 rounded-lg shadow-lg w-full md:w-1/2 hover:shadow-2xl transition-shadow duration-300 ease-in-out ring-2 ring-green-500'>
            <img
              src='/Knight.gif'
              alt='Knight'
              className='w-32 h-32 md:w-40 md:h-40 mb-4'
            />
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
              Rating: {Number.parseFloat(knightInfo.userRating).toFixed(2)}
            </p>
            <p className='text-base mt-2'>
              Global Ranking: {knightInfo.userGlobalRanking}
            </p>
            <p className='text-sm mt-2'>
              Last Updated:
              <a
                href={`https://www.timeanddate.com/worldclock/fixedtime.html?iso=${knightLastUpdatedISO}&msg=Knight%20Last%20Updated`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400 hover:underline ml-1'
              >
                {knightLastUpdatedUTC}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Note and Footer */}
      <div className='w-full mt-auto'>
        <div className='w-full py-2 text-center'>
          <p className='text-sm text-gray-400'>
            The stats may not be 100% accurate due to inaccurate data from
            LeetCode and clist.by
          </p>
        </div>
        <footer className='w-full py-6 text-center'>
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
            className='text-sm text-blue-400 hover:underline mt-2 block'
          >
            Link to GitHub Source Code
          </a>
        </footer>
      </div>
    </main>
  );
}

export const revalidate = 900;
