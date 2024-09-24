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
        padding: 20,
        height: '100%'
    },
    homeContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: colors.primary,
        justifyContent: 'flex-start',
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
        borderRadius: 15,
    },
    boxVert: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        width: '100%',
    },
    textBox: {
        paddingStart: 20,
        textAlign: 'left'
    },
    signUpText: {
        
    },
    title: {
        textAlign: 'center',
        fontSize: 50,
        fontWeight: '600',
    },
    itemBox: {
        backgroundColor: colors.white,
        borderRadius: 15,
        width: '100%',
        height: 100,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    scrollView: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 190,
        rowGap: 20,
    },
    loginMessageBar: {
        width: 'fit-content',
        height: '8%',
        borderRadius: 100,
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        

    },
    buttonText: {
        fontWeight: '600',
    },
    navBar: {
        

    }
});