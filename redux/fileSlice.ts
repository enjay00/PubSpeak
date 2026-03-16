import { FilePath } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FileInitialState = {
  search: string;
  selectedFile: FilePath | null;
  isHold: boolean;
  selectedMultipleFile: FilePath[];
  openDeleteModal: boolean;
  isRenameModalOpen?: boolean;
  renameFile: FilePath | null;
  previewState: "previewFromFiles" | "previewFromOnRecord" | null;
};

let initialState: FileInitialState = {
  search: "",
  selectedFile: null,
  isHold: false,
  selectedMultipleFile: [],
  openDeleteModal: false,
  isRenameModalOpen: false,
  renameFile: null,
  previewState: null,
};

export const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setPreviewState: (
      state,
      action: PayloadAction<FileInitialState["previewState"]>,
    ) => {
      state.previewState = action.payload;
    },
    setSearch: (state, action: PayloadAction<FileInitialState["search"]>) => {
      state.search = action.payload;
    },
    cleanUpSearch: (state) => {
      state.search = "";
    },
    setSelectedFile: (
      state,
      action: PayloadAction<FileInitialState["selectedFile"]>,
    ) => {
      state.selectedFile = action.payload;
    },
    cleanUpSelectedFile: (state) => {
      state.selectedFile = null;
    },
    setIsHold: (state, action: PayloadAction<FileInitialState["isHold"]>) => {
      state.isHold = action.payload;
    },
    cleanUpIsHold: (state) => {
      state.isHold = false;
    },
    setSelectedMultipleFile: (
      state,
      action: PayloadAction<FileInitialState["selectedMultipleFile"]>,
    ) => {
      const newFiles = action.payload;
      const existingUris = new Set(
        state.selectedMultipleFile.map((f) => f.uri),
      );

      newFiles.forEach((file) => {
        if (!existingUris.has(file.uri)) {
          state.selectedMultipleFile.push(file);
          existingUris.add(file.uri);
        }
      });
    },
    cleanUpSelectedMultipleFile: (state) => {
      state.selectedMultipleFile = [];
    },
    setRemoveSelectedMultipleFile: (state, action: PayloadAction<FilePath>) => {
      state.selectedMultipleFile = state.selectedMultipleFile.filter(
        (file) => file.uri !== action.payload.uri,
      );
    },
    setSelectAllFiles: (state, action: PayloadAction<FilePath[]>) => {
      state.selectedMultipleFile = action.payload;
    },
    setOpenDeleteModal: (state, action: PayloadAction<boolean>) => {
      state.openDeleteModal = action.payload;
    },
    setIsRenameModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isRenameModalOpen = action.payload;
    },
    setRenameFile: (
      state,
      action: PayloadAction<FileInitialState["renameFile"]>,
    ) => {
      state.renameFile = action.payload;
    },
    cleanUpRenameFile: (state) => {
      state.renameFile = null;
    },
  },
  extraReducers(builder) {},
});

export const {
  setSearch,
  cleanUpSearch,
  setSelectedFile,
  cleanUpSelectedFile,
  setIsHold,
  cleanUpIsHold,
  setSelectedMultipleFile,
  cleanUpSelectedMultipleFile,
  setRemoveSelectedMultipleFile,
  setSelectAllFiles,
  setOpenDeleteModal,
  setIsRenameModalOpen,
  setRenameFile,
  cleanUpRenameFile,
  setPreviewState,
} = fileSlice.actions;
export default fileSlice.reducer;
