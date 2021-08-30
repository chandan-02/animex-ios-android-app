import React, { Component } from 'react'
import { View, Text, StyleSheet, Dimensions, ImageBackground, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { LinearGradient } from "expo-linear-gradient";
import { Octicons, Ionicons  } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'
import * as firebase from 'firebase'

// My componenets here 
import Card from './AnimComponents/Card'
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export default class Anim extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      episodeList: [],
      searchField: ""
    };
  }

  async componentDidMount() {
    const id = this.props.navigation.getParam("id", "some value");
    console.log(id);
    await firebase.database().ref('Animes').child('AnimeDefination/' + id).orderByKey().once('value').then(res => {
      const arrAnime = []
      // res.forEach(resChild => {
      //   // arrAnime.push(resChild.val()); Object.keys(res.val()),
      //   console.log(resChild.val(),Object.keys(res))
      // });
      //console.log(Object.keys(res.val()),res.val())
      // console.log(res.val()[1])
      console.log(res.val())
      Object.keys(res.val()).map((u, i) => {
        //console.log(res.val()[u],":",u)
        obj = { num: u, link: res.val()[u] };
        arrAnime.push(obj);
      })

      this.setState({
        episodeList: arrAnime
      })
    })
  }

  render() {
    //console.log(this.state.episodeList)
    const { searchField, episodeList } = this.state;
    // var newEpisodelist = episodeList.map((u,i)=>{
    //    if(searchField.includes(i+1)){
    //     return u;
    //    }
    // })
    var newEpisodeList = episodeList.filter((ep, i) => {
      return ep.num.toLowerCase().includes(searchField.toLowerCase())
    })
    //   if(searchField.includes(i+1)){
    //         return ep;
    //        }
    // })
    // console.log(newEpisodelist)
    //var newEpisodelist = episodeList
    const imgURL = this.props.navigation.getParam("img", "some value");
    const name = this.props.navigation.getParam("name", "some value");
    const eps = this.props.navigation.getParam("eps", "some value");
    const plot = this.props.navigation.getParam("plot", "some value");
    const id = this.props.navigation.getParam("id","some value");
    return (
      <LinearGradient colors={["#503568", "#2E2039"]} style={styles.mainModal}>
        <StatusBar style="light" />

        <View style={styles.mainTitle}>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('mainStack')
          }}>
            <Ionicons name="ios-chevron-back" size={35} color={"#fff"} />
          </TouchableOpacity>
          <TextInput keyboardType={"numeric"} placeholder="Search episode..." placeholderTextColor={"#8458AB"} style={styles.heading}
            onChangeText={name => this.setState({ searchField: name })}
            value={this.state.searchField}
          />
          <TouchableOpacity style={{ flex: 0 }} onPress={() => {
            this.setState({
              searchField: ""
            })
            Keyboard.dismiss()
          }}>
            <Ionicons name="close-circle" size={24} color={"#DD93FF"} />
          </TouchableOpacity>

        </View>


        <View style={styles.mainAnimeEntry}>

          <View style={styles.mainImg}>
            <ImageBackground
              style={styles.image}
              imageStyle={{ borderRadius: 10 }}
              source={{ uri: imgURL }}
            ></ImageBackground>
          </View>


          <View style={styles.textContent}>


            <View style={styles.animeName}>
              <Text style={{ fontFamily: 'Poppins', color: '#fff', fontSize: 17, }} >{name}</Text>
              <Text style={{ fontFamily: 'RalewayM', color: '#A48FF4', fontSize: 15, marginTop: 5 }} >Total Episodes : {eps}</Text>
              <Text style={{ fontFamily: 'RalewayM', color: '#B6A6CB', fontSize: 12, marginTop: 5 }} >
                {plot.length > 300 ? height < 650 ? plot.substring(0, 230) + "..." : plot.substring(0, 250) + "..." : plot}
              </Text>
            </View>
          </View>


        </View>

        <View style={{ flex: 0.1, justifyContent: 'center', marginLeft: 10 ,alignItems:'center',}}>
          <TouchableOpacity style={{flexDirection:'row'}} onPress={()=>this.props.navigation.navigate('report',{
            animeName:name
          })}>
            <Octicons size={21} color="#503568" name={'report'} color={"#CC81FF"} />
            <Text style={{
              marginLeft:10,
              fontFamily: 'RalewayM',
              fontSize: 17,
              color:'#CC81FF'
            }}>Report a Problem</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.episodeList}>
          {
            episodeList[0] != undefined ? (
              <FlatList
                numColumns={3}
                keyExtractor={(item) => item.num}
                showsVerticalScrollIndicator={false}
                data={newEpisodeList}
                columnWrapperStyle={{ justifyContent: 'center', }}
                onEndReachedThreshold={0.5}
                renderItem={
                  (data) =>
                  (
                    <Card link={data.item.link} num={data.item.num} name={name} nav={this.props.navigation} />
                  )
                }
              />
            ) :
              <ActivityIndicator size={28} color="#DD93FF" />
          }

        </View>
      </LinearGradient >
    )
  }
}

const styles = StyleSheet.create({
  mainModal: {
    flex: 1,
  },
  mainTitle: {
    marginTop: Constants.statusBarHeight,
    flex: height >= 650 ? 0.11 : 0.15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 15,
    // backgroundColor:'red'
  },

  heading: {
    flex: 1,
    backgroundColor: '#6A468A',
    color: '#fff',
    fontSize: 19,
    fontFamily: 'RalewayM',
    // textAlign: 'center',
    borderWidth: 0,
    padding: 3,
    borderRadius: 5,
    borderColor: "gray",
    marginHorizontal: 5,
    marginHorizontal: 15,
    paddingVertical: 5,
    paddingLeft: 15,
  },
  mainTopIcon: {
    marginTop: Constants.statusBarHeight,
    flex: 0.1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mainAnimeEntry: {
    marginHorizontal: 10,
    flexDirection: 'row',
    flex: height >= 700 ? 0.46 : 0.5,
    //backgroundColor:'blue'
  },
  episodeList: {
    flex: 0.7,
    // backgroundColor:'green'
  },
  image: {
    height: height / 3.2,
    width: width / 2.3,
  },
  textContent: {
    flex: 1,
  },
  animeName: {
    marginLeft: 10,
    // backgroundColor:'aqua',
  }

})

//