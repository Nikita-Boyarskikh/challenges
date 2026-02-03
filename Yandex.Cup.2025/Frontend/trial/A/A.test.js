const { makePreparation, seekPeriodIndicies } = require('./A');

const prepare = (artefactDurations) => {
  let maxDuration = 0;
  let prevEnd = 0;
  const artefacts = artefactDurations.map((duration) => {
    if (duration > maxDuration) {
      maxDuration = duration;
    }

    const result = {
      start: prevEnd,
      end: prevEnd + duration,
    };
    prevEnd = result.end;
    return result;
  });

  const artefactAgesHistogram = new Array(maxDuration + 1).fill(0);
  artefactDurations.forEach((duration) => {
    artefactAgesHistogram[duration]++;
  });

  const analyseArtefact = jest.fn((ix) => artefacts[ix]);
  return {
    artefactAgesHistogram,
    analyseArtefact,
  };
}

it('example', () => {
  const periodDuration = 10;
  const {analyseArtefact, artefactAgesHistogram} = prepare([1, 2, 2, 3, 3, 3, 4, 4, 5]);

  const options = makePreparation(artefactAgesHistogram, periodDuration);

  // [startIx, endIx, actualDuration]
  expect(seekPeriodIndicies(analyseArtefact, 0, options)).toEqual([0, 3, 8]);
  expect(analyseArtefact).toHaveBeenCalledTimes(2);
  analyseArtefact.mockClear();

  expect(seekPeriodIndicies(analyseArtefact, 4, options)).toEqual([4, 6, 10]);
  expect(analyseArtefact).toHaveBeenCalledTimes(1);
  analyseArtefact.mockClear();

  expect(seekPeriodIndicies(analyseArtefact, 7, options)).toEqual([7, 8, 9]);
  expect(analyseArtefact).toHaveBeenCalledTimes(1);
});

it('should work fine with zero artefacts', () => {
  const options = makePreparation([], 0);
  const analyseArtefact = jest.fn();

  // [startIx, endIx, actualDuration]
  expect(seekPeriodIndicies(analyseArtefact, 0, options)).toEqual([0, 0, 0]);
  expect(analyseArtefact).not.toHaveBeenCalled();
});

it('should work with only one artefact', () => {
  const periodDuration = 10;
  const {analyseArtefact, artefactAgesHistogram} = prepare([1]);

  const options = makePreparation(artefactAgesHistogram, periodDuration);

  // [startIx, endIx, actualDuration]
  expect(seekPeriodIndicies(analyseArtefact, 0, options)).toEqual([0, 0, 1]);
  expect(analyseArtefact).toHaveBeenCalledTimes(1);
});

it('should work with one duration artefacts', () => {
  const periodDuration = 10;
  const {analyseArtefact, artefactAgesHistogram} = prepare(new Array(10).fill(1));

  const options = makePreparation(artefactAgesHistogram, periodDuration);

  // [startIx, endIx, actualDuration]
  expect(seekPeriodIndicies(analyseArtefact, 0, options)).toEqual([0, 9, 10]);
  expect(analyseArtefact).toHaveBeenCalledTimes(3);
});
