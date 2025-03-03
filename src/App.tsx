import * as React from 'react'
import './index.css'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Input } from './components/ui/input'
import { Label } from '@radix-ui/react-label'
import readXlsxFile from 'read-excel-file'
import { QRCodeSVG } from 'qrcode.react'
import firebaseConfig from './lib/firebase'
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs } from 'firebase/firestore/lite';
import { writeBatch, doc, addDoc, collection } from "firebase/firestore"; 

type TUser = {
  name: string,
  email: string,
  qrLink: string
}

const defaultData: TUser[] = [
  {
    name: "Nguyen Van A",
    email: "a@gmail.com",
    qrLink: "link"
  },
  {
    name: "Nguyen Van B",
    email: "a@gmail.com",
    qrLink: "link"
  },
  {
    name: "Nguyen Van C",
    email: "a@gmail.com",
    qrLink: "link"
  },
]

const columnHelper = createColumnHelper<TUser>()

const columns = [
  columnHelper.accessor('name', {
    header: "User name",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('email', {
    header: "Email",
    cell: info => info.renderValue(),
  }),
  columnHelper.accessor('qrLink', {
    header: 'QR Link',
  }),
]

const schemaExcel = {
  'name' : {
    prop: 'name',
    type: String
  },
  'email' : {
    prop: 'email',
    type: String
  }
}
type TExcel = {
  name: string,
  email: string
}
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const batch = writeBatch(db)

export default function App() {
  const [data, _setData] = React.useState(() => [...defaultData])
  const [excelFile,setExcelFile] = React.useState()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


  //@ts-expect-error: "abc"
  const prepareDataToSave = (data: ParsedObjectsResult<TExcel>) => {
    console.log(data)
  }
  const getUsers = async (db:any) => {
    const userCol = collection(db, 'user');
    const userSnapshot = await getDocs(userCol);
    const userList = userSnapshot.docs.map(doc => doc.data());
    console.log(userList)
    return userList;
  }
  //@ts-expect-error: "abc"
  const addBunchUsers = async (data:ParsedObjectsResult<TExcel>) => {
    for (let i = 0; i < data.length; i++) {
      const docRef = await addDoc(collection(db,'user'),data[i])
      console.log(docRef)
    }
    return null
  }
  React.useEffect(()=>{
    addBunchUsers(defaultData)
  },[])

  return (
    <div className="p-2">
      <Label>Import from excel</Label>
      <Input type='file' accept='.xlsx' value={excelFile} 
        onChange={(e)=> e.target.files && 
          readXlsxFile(e.target?.files[0],{schema:schemaExcel})
          .then((rows)=>{
            addBunchUsers(rows)
          })
          .then(data=>console.log(data))
        } className='w-56'/>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
    </div>
  )
}
