import { StyleSheet, useWindowDimensions } from "react-native";
import colors from './Colors';

export const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.primary,
        width: '100%',
    },
    homeContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary,
        justifyContent: 'center',
    },
    textField: {
        width: '90%',
        height: 50,
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 15
    },
    textBox: {
        paddingStart: 20
    },
    title: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: '600'
    },
    itemBox: {
        backgroundColor: colors.white,
        borderRadius: 15,
        height: 100,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        
    },
    scrollView: {
        width: '100%',
        
        alignItems: 'center',
        rowGap: 20,
        paddingTop: 200
    }
});