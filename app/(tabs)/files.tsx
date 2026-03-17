import ActionSheet from "@/components/files/action-sheet";
import DeleteSheet from "@/components/files/delete-sheet";
import Filter from "@/components/files/filter";
import List from "@/components/files/list";
import RenameModal from "@/components/files/rename-modal";
import { View } from "react-native";

export default function Files() {
  return (
    <View className="bg-primary-dark px-4 pt-4 flex-1">
      <Filter />
      <List />
      <ActionSheet />
      <DeleteSheet />
      <RenameModal />
    </View>
  );
}
