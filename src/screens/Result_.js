import React, { useState,  useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Result from './Result';

const Result_ = ({route}) => {
    const navigation = useNavigation();
    const { title, image, explanation, date, bookmarked, updateBookmark } = route.params;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.magazineItem}
            onPress={() => handleResult(item)}
        >
            <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.datetime}>Date: {item.datetime}</Text>
                    <TouchableOpacity style={styles.bookmarkContainer}>
                        <Icon
                            name={item.bookmarked ? 'bookmark' : 'bookmark-border'}
                            size={24}
                            color={item.bookmarked ? 'blue' : 'gray'}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.smallTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );


    const [isBookmarked, setIsBookmarked] = useState(bookmarked);

    useEffect(() => {
        setIsBookmarked(bookmarked);
    }, [bookmarked]);

    const toggleBookmark = () => {
        const updatedBookmark = !isBookmarked;
        setIsBookmarked(updatedBookmark);
        updateBookmark({ id: route.params.id, bookmarked: updatedBookmark });
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#2D5E40" />
                </TouchableOpacity>
                <Text style={styles.title}>{title}</Text>
                <Image source={image} style={styles.image} />
                <View style={styles.infoContainer}>
                    <Text style={styles.date}>Date: {date}</Text>
                    <View style={styles.bookmarkContainer}>
                        <Text style={styles.bookmarkText}>Bookmarked: </Text>
                        <TouchableOpacity onPress={toggleBookmark}>
                            <Icon
                                name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                                size={24}
                                color={isBookmarked ? 'blue' : 'gray'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.explanation}>{explanation}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 25,
        zIndex: 1,
        right: 30,
    },
    title: {
        fontSize: 30,
        color: '#8CB972',
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 40,
    },
    image: {
        width: '90%',
        height: 250,
        borderRadius: 10,
        marginVertical: 20,
    },
    explanation: {
        fontSize: 16,
        backgroundColor: '#E5EFDF',
        borderRadius: 10,
        color: '#2D5E40',
        borderWidth: 1,
        borderColor: '#2D5E40',
        padding: 20,
        width: '90%',
    },
    infoContainer: {
        alignItems: 'flex-start',
        margin: 10,
        left: "-20%",
        marginBottom: 20,
    },
    bookmarkContainer: {
        flexDirection: 'row',
    },
    bookmarkText: { // 북마크 텍스트 스타일 추가
        fontSize: 16,
    },
});

export default Result_;




