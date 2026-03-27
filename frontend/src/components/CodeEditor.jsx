import Editor from "@monaco-editor/react"

export default function CodeEditor({code,setCode}){

return(

<Editor
height="400px"
theme="vs-dark"
defaultLanguage="javascript"
value={code}
onChange={(value)=>setCode(value)}
/>

)

}