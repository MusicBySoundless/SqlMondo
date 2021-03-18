function compare( a, b ) {
	//stworzone po to, żeby móc posortować wpisy w aktywnościach według czasu startu
	if ( a.StartTime < b.StartTime ){
	  return -1;
	}
	if ( a.StartTime > b.StartTime ){
	  return 1;
	}
	return 0;
}

module.exports = compare;