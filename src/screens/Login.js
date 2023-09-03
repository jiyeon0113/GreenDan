import React, { useState, useEffect } from 'react';
import {
    View, Text,
    StyleSheet, Image,
    TouchableOpacity,
    FlatList,
    Alert,
    TextInput,
} from 'react-native';
import Input, { KeyboardTypes, ReturnKeyTypes } from '../components/Input';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import versionCheck from 'react-native-version-check'; // 추가: react-native-version-check 라이브러리를 임포트

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [currentVersion, setCurrentVersion] = useState('vol 0.0.9'); // 추가: 현재 앱 버전 상태 추가
    const [latestVersion, setLatestVersion] = useState('vol 0.0.9'); // 추가: 최신 앱 버전 상태 추가

    useEffect(() => {
        const getToken = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('authToken');
            if (accessToken !== null) {
            setToken(accessToken);
            } else {
            console.error('authToken이 없음!!');
            }
        } catch (error) {
            console.error('토큰 에러 : ', error);
        }
        };
        getToken();

        // 추가: 앱 버전 확인 코드
        async function checkAppVersion() {
        const appVersion = await versionCheck.getAppVersion();
        setCurrentVersion(appVersion);

        try {
            const latest = await versionCheck.getLatestVersion({
            provider: 'playStore', // 또는 'appStore' (iOS) 를 사용할 수 있습니다.
            });
            setLatestVersion(latest);

            if (latest && appVersion !== latest) {
            console.log('업데이트가 필요합니다.');
            // 업데이트 필요 시 사용자에게 알림을 보여주거나 업데이트를 유도하는 로직 추가
            } else {
            console.log('최신 버전을 사용 중입니다.');
            }
        } catch (error) {
            console.error('버전 확인 에러 : ', error);
        }
        }

        checkAppVersion();
    }, []);

    const isEmailValid = email => {
        const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        return emailPattern.test(email);
    };

    const isLoginEnabled = () => {
        return email.length > 0 && password.length > 0 && isEmailValid(email);
    };

    const handleTermsScreen = () => {
        navigation.navigate('TermsScreen');
    };

    const handleLogin = async () => {
        if (!isLoginEnabled()) {
        if (email.length === 0 || password.length === 0) {
            Alert.alert('로그인 실패', '아이디와 비밀번호를 모두 입력해주세요.', [{ text: '확인' }]);
        } else if (!isEmailValid(email)) {
            Alert.alert('로그인 실패', '올바른 이메일 형식이 아닙니다. 다시 확인해주세요.', [{ text: '확인' }]);
        }
        } else {
        // Simulate a successful login
        Alert.alert('로그인 성공', '로그인에 성공했습니다.', [{ text: '확인' }]);
        }

        try {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        });

        const djServer = await fetch('http://192.168.1.102:8000/accounts/dj-rest-auth/login/', {
            method: 'POST',
            headers,
            body: JSON.stringify({
            email,
            password,
            }),
        });

        if (djServer.status === 200) {
            navigation.navigate('Home', { token });
        } else {
            const responseData = await djServer.json();
            console.error('API 요청 실패 : ', responseData);
        }
        } catch (error) {
        console.error('API 요청 실패:', error)
        }
    };

    const handlePW_findScreen = () => {
        navigation.navigate('Pw_find');
    };

    const data = [
        { key: 'SignUp', title: '회원 가입', onPress: handleTermsScreen },
        { key: 'PwFind', title: '비밀번호 찾기', onPress: handlePW_findScreen },
    ];

    const renderItem = ({ item }) => (
        <TouchableOpacity
        style={styles.button}
        onPress={item.onPress}
        >
        <Text style={styles.textButton}>{item.title}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/main.png')} style={styles.image} />
            <Text style={styles.baseText}>GreenDan</Text>
            <TextInput
                title={'이메일'}
                style={styles.input}
                placeholder="your@mail.com"
                keyboardType={KeyboardTypes.EMAIL}
                returnKeyType={ReturnKeyTypes.NEXT}
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <TextInput
                title={'비밀번호'}
                style={styles.input}
                placeholder="pw"
                returnKeyType={ReturnKeyTypes.DONE}
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity
                style={styles.mainButton}
                onPress={handleLogin}
            >
                <Text style={styles.mainButtonText}>Login</Text>
            </TouchableOpacity>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                contentContainerStyle={styles.buttonContainer}
            />
                <View>
                    <Text style={styles.text}>현재 버전: {currentVersion}</Text>
                    <Text style={styles.text}>최신 버전: {latestVersion}</Text> 
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    baseText: {
        fontSize: 40,
        color: '#8CB972',
        fontWeight: 'bold',
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 10,
        borderColor: 'white',
    },
    mainButton: {
        fontSize: 20,
        borderRadius: 10,
        paddingHorizontal: 130,
        paddingVertical: 5,
        margin: 5,
        backgroundColor: '#2D5E40',
        borderColor: '#2D5E40',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButtonText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold',
    },
    textButton: {
        fontSize: 20,
        color: 'gray',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 1,
        marginLeft: 20,
        marginBottom: 150,
    },
    button: {
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        color: '#2D5E40',
    },
    image: {
        marginBottom: 20,
    },
    text: {
        marginTop: 10,
        fontSize: 14,
        color: '#2D5E40',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        width: '80%',
        borderRadius: 5,
        backgroundColor: '#E5EFDF',
        color: '#538454',
    },
});

export default Login;
