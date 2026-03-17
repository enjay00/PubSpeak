import { Image } from "expo-image";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const PROPONENTS_LIST = [
  {
    name: "Raily Almeron",
    email: "yliarnoremla@gmail.com",
    address: "Quezon City, Philippines",
    image: require("@/assets/proponents/IMG_20230911_121010_511-removebg-preview.png"),
  },
  {
    name: "Loyd Ashlie Mirabuna",
    email: "loydash09@gmail.com",
    address: "Quezon City, Philippines",
    image: require("@/assets/proponents/Loyd Mirabuna.png"),
  },
  {
    name: "Andrei Tirao",
    email: "tirao.andreib@gmail.com",
    address: "Quezon City, Philippines",
    image: require("@/assets/proponents/Andrei_Tirao-removebg-preview.png"),
  },
  {
    name: " Christian Lloyd Vasquez",
    email: "vasquez1@gmail.com",
    address: "Quezon City, Philippines",
    image: require("@/assets/proponents/Christian Vasquez.png"),
  },
<<<<<<< HEAD
  {
    name: "Niel Jhon Montero",
    email: "nieljhonmontero@gmail.com",
    address: "Quezon City, Philippines",
    image: require("@/assets/proponents/Christian Vasquez.png"),
  },
=======
>>>>>>> 5c9e6e7154d99abe917e80615a7b04ead0602020
];

export default function AboutUs() {
  return (
    <ScrollView
      className="bg-primary-dark"
      contentContainerClassName="w-11/12 self-center py-4"
    >
      <View className="bg-white rounded-full w-36 h-36 justify-center items-center self-center">
        <Image
          source={require("@/assets/images/pubspeaker-logo.png")}
          style={{ width: 138, height: 138, alignSelf: "center" }}
        />
      </View>

      <View className="bg-secondary-dark p-4 rounded-[15px] mt-6">
        <Text className="text-primary-light font-open-sans-bold text-justify text-[10px]">
          PubSpeaker{" "}
          <Text className="font-open-sans">
            is a mobile application that helps user refine their public speaking
            skills by focusing on pronunciation and grammar. It analyzes
            recorded speeches and provides real-time, locally stored feedback
            without requiring internet access.
          </Text>
        </Text>
      </View>

      {PROPONENTS_LIST.map((proponent, index) => (
        <View
          key={index}
          className="bg-secondary-dark p-4 flex-row justify-between gap-6 mt-6 rounded-[15px]"
        >
<<<<<<< HEAD
          <View className="bg-[#F5F5F5] w-34.25 h-37.5 justify-center items-center rounded-[15px]">
=======
          <View className="bg-[#531919] w-34.25 h-37.5 justify-center items-center rounded-[15px]">
>>>>>>> 5c9e6e7154d99abe917e80615a7b04ead0602020
            <Image
              source={proponent.image}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-open-sans text-primary-light">
              Name: {proponent.name}
            </Text>
            <Text className="text-xs font-open-sans text-primary-light">
              Email: {proponent.email}
            </Text>
            <Text className="text-xs font-open-sans text-primary-light">
              Address: {proponent.address}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
