# Раскопки Таримской впадины (40 баллов)
Ограничение времени: 10 с
Ограничение памяти: 570.3 Мб
Ввод: input.json
Вывод: output.json

Великий шёлковый путь соединял Восточную Азию с Западом, служа важнейшей торговой артерией со II века до н. э. до XV века н. э. Часть маршрута проходила через Таримскую впадину, и богатая история региона нашла отражение в археологических находках, которые свидетельствуют о разнообразии культур, существовавших здесь на протяжении веков.

Археологи раскопали множество реликвий и уже распределили их по возрасту, исходя из глубины, на которой они были обнаружены. Однако, чтобы точно определить возраст каждой находки, необходимо проводить сложное и дорогостоящее исследование.

К счастью, учёным не обязательно знать точный возраст каждой находки — им достаточно знать лишь столетие, к которому она относится. Ваша задача — помочь исследователям атрибутировать артефакты с конкретными столетиями, выполнив минимальное количество затратных исследований.

### Задача
Необходимо реализовать функции, позволяющие сгруппировать артефакты в периоды длительностью не более указанной. Артефакты с индексами отличающимися на 1 имеют одинаковое конец/начало, то есть:

```js
console.log(analyzeArtefact(ix).end === analyzeArtefact(ix+1).start);
// true
```

### Описание функций

**analyseArtefact**
- На вход analyseArtefact получает индекс артефакта для анализа.
- На выход analyseArtefact возвращает объект { start: number, end: number}, где [start, end] – результат анализа возраста артефакта, целые неотрицательные числа, также выполняется неравенство start < end (см. в примере константу artefacts).

**makePreparation**
- На вход makePreparation получает гистограмму возрастов артефактов artefactAgesHistogram и максимальную длительность периода в годах periodDuration (см. в примере константу artefactAgesHistogram).
- На выход makePreparation возвращает объект любой структуры, он будет передан в неизменном виде в каждый из вызовов функции seekContainerIndicies в параметре options.

**seekContainerIndicies**
- seekPeriodIndicies вызывается последовательно для всего списка артефактов, пока он не будет пройден полностью. На вход функция получает:
    * analyseArtefact – функцию-аналайзер артефакта по индексу,
    * startIndex – индекс артефакта,
    * options – полезные опции, которые были вычислены в предыдущей функции.
- seekPeriodIndicies возвращает массив длиной 3 – [startIndex, endIndex, actualDuration]
    * startIndex – индекс первого артефакта в периоде,
    * endIndex – индекс последнего артефакта в периоде,
    * actualDuration – фактическая длительность от start самого первого артефакта до end самого последнего артефакта в найденном периоде.

### Примеры

```js
// age   -> 0 1 2 3 4 5 6
// count -> 0 1 2 3 2 1 0
const artefactAgesHistogram = [0,1,2,3,2,1,0];
const options = makePreparation(artefactAgesHistogram, 10);
// { allArtefactAgeDuration: 27, artefactsCount: 9, periodsCount: 2.7, ..., maxDuration: 10 }

// синтетический пример когда все артефакты датированы
const artefacts = [
    // -- first period
    { start: 0, end: 1 },
    { start: 1, end: 3 },
    { start: 3, end: 5 },
    { start: 5, end: 8 },
    // -- second period
    { start: 8, end: 11 },
    { start: 11, end: 14 },
    { start: 14, end: 18 },
    // -- third period
    { start: 18, end: 22 },
    { start: 22, end: 27 }
];

// функция для анализа артефакта
const analyseArtefact = (ix) => artefacts[ix];

// количество артефактов соответствует количеству артефактов, посчитанному в options
artefacts.length === options.artefactsCount;
// true

// функция для поиска индексов периода и его фактической длины
// [startIx, endIx, actualDuration]
seekPeriodIndicies(analyseArtefact, 0, options);
// [0, 3, 8]
//     ^ + 1 – next seek index is 4
seekPeriodIndicies(analyseArtefact, 4, options);
// [4, 6, 10]
//     ^ + 1 – next seek index is 7
seekPeriodIndicies(analyseArtefact, 7, options);
// [7, 8, 9]
//     ^ + 1 – next seek index is not exist
```

### Формат ввода
```js
const makePreparation = (artefactAgesHistogram, periodDuration) => {
    // prepare options
    return {
        // some options
    };
};

const seekPeriodIndicies = (analyseArtefact, startIndex, options) => {
    // code here
    return [startIndex, endIndex, actualDuration];
};

module.exports = {
    makePreparation,
    seekPeriodIndicies
};
```

### Примечание
Необходимое условие проходждения тестов – правильно разложенные артефакты по периодам общей длительностью не более periodDuration указанной в функции makePreparation(artefactAgesHistogram, periodDuration). Функция seekPeriodIndicies вызывается всякий раз со значением startIndex – 0 (для первого вызова) или endIndex + 1 (для последующих), тем самым формируется массив результатов вызова функции (а именно индексов и фактических длительностей получившихся периодов), что и будет сравниваться с эталонным результатом теста. Если вы выполните полный анализ всех артефактов, то при полном прохождении всех тестов получите только 1 балл.

Достаточное условие – минимально возможное количество анализов артефактов, к которым было обращение по индексу, то есть фактическое количество вызовов функции analyseArtefact. Наиболее оптимальные решения получат близкую к 40 баллам оценку.
