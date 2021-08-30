import React, { Component } from 'react'
import { View, StyleSheet, Text, Dimensions, ActivityIndicator, Platform, FlatList, TouchableOpacity } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from '@expo/vector-icons'
import { Video } from 'expo-av';
import cio from 'cheerio-without-node-native';
import cheerio from 'cheerio-without-node-native/lib/cheerio';
import * as ScreenOrientation from 'expo-screen-orientation';
import WebView from 'react-native-webview';
import * as Linking from 'expo-linking';
// const cheerio = require('cheerio');
// const axios = require('axios');

global.Buffer = global.Buffer || require('buffer').Buffer
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default class Watch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: "",
            ep_array: [],
            streamLink: {},
        };
    }
    async componentDidMount() {
        // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        const link = this.props.navigation.getParam("link", "some value");
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


    logDimension = () => {
        console.log("height : ", height, "||", "width : ", width)
    }

    textHeader = () => {
        const { ep_array, link, streamLink } = this.state;
        const num = this.props.navigation.getParam("num", "some value");
        const name = this.props.navigation.getParam("name", "some value");
        return (
            <View style={styles.title}>
                <Text style={{
                    color: "#fff",
                    fontFamily: 'RalewayM',
                    fontSize: 18,
                    margin: 10,
                    marginLeft: 15,
                }}>{"Currently playing : " + name + " Episode - " + num}</Text>
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
                onPress={()=> {
                    Linking.openURL(this.props.navigation.getParam("link", "some value"))
                    console.log("opening using web")
                }}
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
        return (
            <View>
                <Text style={{
                    color: "#B6A6CB",
                    fontFamily: 'RalewayM',
                    fontSize: 15,
                    margin: 10,
                    marginLeft: 15,
                }}>
                    If default server is not working, 
                    then please try mirror links above. 
                    Otherwise report this problem from the previous screen.
                </Text>
                <View style={{marginTop:0}}></View>
            </View>
        )
    }

    render() {
        const { ep_array, link, streamLink } = this.state;
        console.log(ep_array);
        // console.log(ep_array[0].link)
        //ep_array[0].ep_link == undefined ? console.log("waiting") :console.log(ep_array[0].ep_link)
        const num = this.props.navigation.getParam("num", "some value");
        const name = this.props.navigation.getParam("name", "some value");
        // console.log("https:"+link);
        return (
            <LinearGradient colors={["#8458AB", "#503568"]} style={styles.main}>
                <View style={styles.header}>
                    <Ionicons size={40} color="#503568" style={{ marginBottom: Platform.OS === 'android' ? -15 : -10 }} name={'ellipsis-horizontal'} />
                </View>

                {
                    ep_array[0] == undefined ? <ActivityIndicator size={28} color="#DD93FF" /> :

                        <Video
                            source={{ uri: streamLink.ep_link }}
                            rate={1.0}
                            volume={100.0}
                            isMuted={false}
                            resizeMode="contain"
                            shouldPlay={false}
                            isLooping
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
                <FlatList
                    keyExtractor={(item) => item.name}
                    ListHeaderComponent={this.textHeader}
                    ListFooterComponent={this.textFooter}
                    columnWrapperStyle={{
                        marginLeft:5,
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
            </LinearGradient>
        )
    }
}


const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center'
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

//some usefull trash 
//
// console.log(ScreenOrientation.getOrientationAsync());
                                            // if(await ScreenOrientation.getOrientationAsync() === ScreenOrientation.Orientation.LANDSCAPE_RIGHT){
                                            //     await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
                                            // }else{
                                            //     await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
                                            //     // await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
                                            // }