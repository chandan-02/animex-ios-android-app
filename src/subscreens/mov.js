import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Octicons, Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
import * as firebase from 'firebase'
import cheerio from 'cheerio-without-node-native/lib/cheerio';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Video } from 'expo-av';
import * as Linking from 'expo-linking';

global.Buffer = global.Buffer || require('buffer').Buffer

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export default class Mov extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false,
            link: "",
            ep_array: [],
            streamLink: {},
            // episodeList: [],
            // searchField: ""
        };
    }

    async componentDidMount() {
        // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        const link = this.props.navigation.getParam("streamUrl", "some value");
        var ep_array = []
        const res = await fetch(link);
        const htmlString = await (await res.text()).substr(0, 4550);
        const $ = cheerio.load(htmlString)
        $('div.mirror_link div').each((index, element) => {
            var ep_name = $(element).find('a').html()
            var ep_link = $(element).find('a').attr('href')
            var name = "Link " + Number(index + 1)
            if (index < 4) {
                var ep_dic = { 'quality': ep_name.replace('Download\n', 'watch').replace(/ +/g, ""), 'ep_link': ep_link, 'name': name }
                ep_array.push(ep_dic)
            } else {
                var ep_dic = { 'quality': ep_name.replace('Download\n', 'watch').replace(/ +/g, ""), 'ep_link': ep_link }
                ep_array.push(ep_dic)
            }
        })
        //console.log(ep_array)
        await this.setState({ ep_array: ep_array })
        this.setState({ streamLink: this.state.ep_array[0] })
    }

    textHeader = () => {
        const { ep_array, link, streamLink } = this.state;
        // const num = this.props.navigation.getParam("num", "some value");
        const name = this.props.navigation.getParam("name", "some value");
        return (
            <View style={styles.title}>
                <Text style={{
                    color: "#fff",
                    fontFamily: 'RalewayM',
                    fontSize: 18,
                    margin: 10,
                    marginLeft: 15,
                }}>{"Currently playing : " + name}</Text>

<View style={styles.divTwo}>
                <TouchableOpacity style={styles.coverText} 
                onPress={()=> Linking.openURL(streamLink.ep_link)}
                >
                    <Text 
                    style={{
                        textAlign:'center', 
                        color: "#FFF",
                        fontFamily: 'RalewayM',
                        fontSize: 14,
                    }}>Open in External Player</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.coverText} 
                onPress={()=> {Linking.openURL(this.props.navigation.getParam("streamUrl", "some value"))}}
                >
                    <Text 
                    style={{
                        textAlign:'center', 
                        color: "#FFF",
                        fontFamily: 'RalewayM',
                        fontSize: 14,
                    }}><Ionicons size={15} color="#fff" name={'download-outline'} />  Download Now </Text>
                </TouchableOpacity>
                </View>
                <Text style={{
                    color: "#B6A6CB",
                    fontFamily: 'RalewayM',
                    fontSize: 15,
                    margin: 10,
                    marginLeft: 15,
                }}>
                    If video is not playing or stucked. Click above to open in external video players such as your default device player or a downloaded one.
                    
                </Text>
                <Text style={{
                    color: "#A48FF4",
                    fontFamily: 'RalewayM',
                    fontSize: 18,
                    margin: 10,
                    marginLeft: 15,
                }}>Active Streaming Server: {ep_array[0] == undefined ? "loading..." : streamLink.name}</Text>

            </View>
        )
    }
    textFooter = () => {
        const name = this.props.navigation.getParam("name", "some value");
        const plot = this.props.navigation.getParam("plot", "some value");
        return (
            <View>
                <View style={{ flex: 0.1, marginLeft:17,marginVertical:10,}}>
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.navigate('report', {
                        animeName: name
                    })}>
                        <Octicons size={21} color="#503568" name={'report'} color={"#CC81FF"} />
                        <Text style={{
                            marginLeft: 10,
                            fontFamily: 'RalewayM',
                            fontSize: 17,
                            color: '#CC81FF'
                        }}>Report a Problem</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{ fontFamily: 'RalewayM', color: '#B6A6CB', fontSize: 15, marginTop: 5,marginLeft:17 }}>
                    Plot : {plot}
                    </Text>
                </View>
            </View>

        )
    }
    render() {
        const { ep_array, link, streamLink } = this.state;
        return (
            <LinearGradient colors={["#503568", "#2E2039"]} style={styles.mainModal}>
                <StatusBar style="light" />

                <View style={styles.mainTitle}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                        this.props.navigation.navigate('mainStack')
                    }}>
                        <Ionicons name="ios-chevron-back" size={35} color={"#fff"} />
                        <Text style={{ color: "#fff", fontSize: 21, fontFamily: 'Poppins' }}>Go back</Text>
                    </TouchableOpacity>
                </View>


                {
                    ep_array[0] == undefined ? <ActivityIndicator size={28} color="#DD93FF" /> :

                        <Video
                            source={{ uri: streamLink.ep_link }}
                            rate={1.0}
                            volume={100.0}
                            isMuted={false}
                            resizeMode="contain"
                            shouldPlay={true}
                            isLooping
                            isBuffering={()=>{return (<Text>load</Text>)}}
                            useNativeControls
                            style={{ width: width - 20, height: 220, margin: 10, borderRadius: 5, }}
                            onFullscreenUpdate={async ({ fullscreenUpdate }) => {
                                if (Platform.OS === 'android') {
                                    switch (fullscreenUpdate) {
                                        case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                                            await ScreenOrientation.unlockAsync();
                                            break;
                                        case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                                            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
                                            break;
                                    }
                                }
                            }}
                        />
                }
                {
                    ep_array[0] == undefined ? (<Text style={{ marginTop: 20, textAlign: 'center', color: "#fff", fontSize: 21 }}>Loading...</Text>) : (
                        <FlatList
                            keyExtractor={(item) => item.name}
                            ListHeaderComponent={this.textHeader}
                            ListFooterComponent={this.textFooter}
                            columnWrapperStyle={{
                                marginLeft: 5,
                                // justifyContent: 'center',
                                // backgroundColor:"#rgba(228, 129, 255, 0.1)",

                            }}
                            showsVerticalScrollIndicator={false}
                            numColumns={4}
                            data={ep_array}
                            renderItem={(data) => (
                                data.item.name != undefined ?
                                    <TouchableOpacity style={styles.coverText} onPress={() => {
                                        this.setState({
                                            streamLink: data.item
                                        })
                                    }}>
                                        <Text style={{
                                            color: streamLink.name == data.item.name ? "#fff" : "#CC81FF",
                                            fontFamily: 'RalewayM',
                                            fontSize: 17,
                                        }}>{data.item.name}</Text>
                                    </TouchableOpacity> :
                                    console.log("No name")
                            )
                            }
                        />
                    )
                }

            </LinearGradient>)
    }
}

const styles = StyleSheet.create({
    mainModal: {
        flex: 1,
    },
    mainTitle: {
        marginTop: Constants.statusBarHeight,
        // flex: height >= 650 ? 0.11 : 0.11,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        marginRight: 15,
        // backgroundColor:'red'
    },
    mainAnimeEntry: {
        marginHorizontal: 10,
        flexDirection: 'row',
        flex: height >= 700 ? 0.46 : 0.5,
        //backgroundColor:'blue'
    },
    coverText: {
        backgroundColor: "#9663C3",
        padding: 7,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 5,
    },
    divTwo:{
        flexDirection:'row',
        flexWrap:'wrap'
    }
})
