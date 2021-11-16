export default function getColor(info) {
    if (info.status === 'available') {
      return '';
    } else if (info.status === 'unavailable') {
      return Colors.gray;
    } else if (info.status === 'booked') {
      return Colors.lightPrimaryColor;
    }
  }

  const Colors = {
    primaryColor: '#28A3DA',
    lightPrimaryColor: 'rgba(40,163,218, 0.2)',
    transparent: 'transparent',
    white: 'white',
    lightWhite: 'rgba(255, 255, 255, 0.5)',
    black: 'black',
    lightBlack: '#686868',
    bgColor: '#F5F8FA',
    lightGray: 'rgba(27, 27, 27, 0.5)',
    titleColor: 'rgba(27, 27, 27, 1)',
    gray: 'rgba(225, 225, 225, 1)',
    lightPlacehoderColor: '#63cb72',
    orange: 'rgba(246, 146, 30, 1)',
    border: 'rgba(27, 27, 27, 0.15)',
  };