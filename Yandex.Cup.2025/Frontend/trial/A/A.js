const makePreparation = (artefactAgesHistogram, periodDuration) => {
  // Вычисляем общее количество артефактов и общую длительность всех артефактов
  let artefactsCount = 0;
  let allArtefactAgeDuration = 0;
  for (let i = 0; i < artefactAgesHistogram.length; i++) {
    artefactsCount += artefactAgesHistogram[i];
    allArtefactAgeDuration += i * artefactAgesHistogram[i];
  }

  // Оценочное количество артефактов в периоде
  const avgArtefactsPerPeriod = Math.floor(periodDuration * artefactsCount / allArtefactAgeDuration);

  return {
    artefactsCount,
    allArtefactAgeDuration,
    avgArtefactsPerPeriod,
    periodDuration,
    cache: {},
    prevPeriodEnd: 0,
  };
};

const seekPeriodIndicies = (analyseArtefact, startIndex, options) => {
  if (options.artefactsCount === 0) {
    return [startIndex, startIndex, 0];
  }

  const lastIndex = options.artefactsCount;

  const analyseEnd = (index) => {
    if (!options.cache[index]) {
      if (index < lastIndex && !options.cache[index + 1] || index === 0) {
        const {start, end} = analyseArtefact(index);
        options.cache[index] = start;
        options.cache[index + 1] = end;
      } else if (index > 0 && !options.cache[index - 1] || index === lastIndex) {
        const {start, end} = analyseArtefact(index - 1);
        options.cache[index - 1] = start;
        options.cache[index] = end;
      } else {
        const {start, end} = analyseArtefact(index);
        options.cache[index] = start;
        options.cache[index + 1] = end;
      }
    }
    return options.cache[index];
  }

  // Если это последний артефакт
  if (startIndex === lastIndex - 1) {
    const start = analyseEnd(startIndex);
    const end = analyseEnd(startIndex + 1);
    return [startIndex, startIndex, end - start];
  }

  const startTime = options.prevPeriodEnd;

  // Бинарный поиск для нахождения максимального endIndex
  let left = startIndex;
  let right = lastIndex;
  let bestEndIndex = startIndex;
  let bestDuration = 0;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midArtefactEnd = analyseEnd(mid);
    const duration = midArtefactEnd - startTime;

    if (duration <= options.periodDuration) {
      // Этот mid подходит, пробуем увеличить
      bestEndIndex = mid - 1;
      options.prevPeriodEnd = midArtefactEnd;
      bestDuration = duration;
      left = mid + 1;
    } else {
      // Слишком большая длительность, уменьшаем
      right = mid - 1;
    }
  }

  return [startIndex, bestEndIndex, bestDuration];
};

module.exports = {
  makePreparation,
  seekPeriodIndicies
};
