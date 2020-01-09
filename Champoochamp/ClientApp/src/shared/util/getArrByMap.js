const getArrByMap = map => {
  const arr = [];
  for (let [key, value] of map) {
    const object = {
      id: key,
      status: value
    };
    arr.push(object);
  }

  return arr;
}

export default getArrByMap;