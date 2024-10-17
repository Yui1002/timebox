import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
console.log(width, height);
console.log(Dimensions.get('screen').width, Dimensions.get('screen').height)

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale, width, height };