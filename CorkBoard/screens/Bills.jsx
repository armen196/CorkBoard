import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, Animated, Text, View, TextInput, SafeAreaView, Button, FlatList, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
//import { styles } from '../styles';
import color from '../Colors';
import { getList, makeItem, makeList, print } from '../scripts';
import { SwipeListView } from 'react-native-swipe-list-view';

// export default function Bills() {
//     return (
//         <Text>Hello bills</Text>
//     );
// }

const Bills = () => {
    // Sample data for the list
    const [listData, setListData] = useState(
        Array(5)
            .fill('')
            .map((_, i) => ({ key: `${i}`, text: `Item ${i + 1}` }))
    );

    // Handle deleting an item
    const deleteRow = (rowKey) => {
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setListData(newData);
    };

    return (
        <View style={styles.container}>
            <SwipeListView
                data={listData}
                renderItem={(data, rowMap) => (
                    <View style={styles.rowFront}>
                        <Text>{data.item.text}</Text>
                    </View>
                )}
                renderHiddenItem={(data, rowMap) => (
                    <View style={styles.rowBack}>
                        <TouchableOpacity
                            style={[styles.backRightBtn, styles.backRightBtnLeft]}
                            onPress={() => console.log('Edit button clicked!')}
                        >
                            <Text style={styles.backTextWhite}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.backRightBtn, styles.backRightBtnRight]}
                            onPress={() => deleteRow(data.item.key)}
                        >
                            <Text style={styles.backTextWhite}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                leftOpenValue={75}  // Width for the left swipe (edit button)
                rightOpenValue={-75} // Width for the right swipe (delete button)
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    rowFront: {
        backgroundColor: '#ccc',
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 60,
        paddingLeft: 15,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
    backTextWhite: {
        color: '#FFF',
    },
});

export default Bills;