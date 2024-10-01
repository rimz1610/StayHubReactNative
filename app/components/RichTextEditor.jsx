import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { StyleSheet, Text, View } from "react-native";

const RichTextEditor = ({ initialValue, onChange }) => {
  const richEditorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(initialValue);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && richEditorRef.current && initialValue) {
      richEditorRef.current.setContentHTML(initialValue);
      setIsInitialLoad(false);
    }
  }, [initialValue, isInitialLoad]);

  const handleContentChange = useCallback(
    (content) => {
      setEditorContent(content);
      onChange(content);
    },
    [onChange]
  );

  return (
    <View style={styles.editorContainer}>
      <RichToolbar
        editor={richEditorRef}
        style={styles.toolbar}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.heading1,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.insertLink,
          actions.undo,
          actions.redo,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={[{ color: tintColor }]}>H1</Text>
          ),
        }}
      />
      <RichEditor
        ref={richEditorRef}
        style={styles.editor}
        placeholder="Enter Here..."
        placeholderTextColor="#999"
        onChange={handleContentChange}
        initialContentHTML={editorContent}
      />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    minHeight: 200,
    maxHeight: 400,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 10,
  },
  toolbar: {
    backgroundColor: "#f7f7f7",
  },
  editor: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
});
