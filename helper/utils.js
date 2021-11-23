module.exports.getPage = (array, page, range) => {
    return new Promise(resolve => {
        let begin = range * (page - 1);
        let end = (range * page > array.length ? array.length : begin + range);
        resolve(array.slice(begin, end));
    });
}