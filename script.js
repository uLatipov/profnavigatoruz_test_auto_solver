const tests = [37, 28, 35];
const pupils = [];

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const getUserInfo = async (lastName, firstName) => {
  const request = await fetch(
    `http://profnavigator.uz/pupil/add2?schoolId=399&klass=11&lastName=${lastName}&firstName=${firstName}`,
    {
      method: "POST",
    }
  );
  const data = await request.json();
  return data;
};

const generateAnswers = async (testID) => {
  let result = [];
  const request = await fetch(
    `http://profnavigator.uz/test/getTest2?methodId=${testID}&language=1`,
    {
      headers: {
        Accept: "application/json, text/plain, */*",
      },
    }
  );
  const data = await request.json();
  for (let i of data.data) {
    const answer = getRandomArbitrary(0, i.answers.length);
    result.push(i.answers[answer].id);
  }
  return result.join();
};

const sendTestResult = async (pupil, testID, answers) => {
  const url = `http://profnavigator.uz/test/checkResult2?testMethodId=${testID}&pupilId=${pupil}&language=1&testResult=${answers}`;
  const request = await fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
    },
  });
  const result = await request.json();

  return result;
};

const main = async () => {
  for (let testID of tests) {
    for (let pupil of pupils) {
      const pupilData = await getUserInfo(pupil.lastName, pupil.firstName);
      const answers = await generateAnswers(testID);
      const result = await sendTestResult(pupilData.id, testID, answers);

      console.log(result);
    }
  }
};
