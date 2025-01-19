import {StyleSheet} from 'react-native';
import {COLORS, FONT_WEIGHT} from './theme';

export default class ButtonStyle {
    static createBasicButtonStyle() {
        return StyleSheet.create({
            button: {
                width: 300,
                height: 34,
                backgroundColor: COLORS.BLUE,
                borderRadius: 10,
                marginVertical: 20
            }
        })
    }
}