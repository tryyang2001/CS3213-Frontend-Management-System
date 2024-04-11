import { RxQuestionMarkCircled } from "react-icons/rx";
import {
  MdDelete,
  MdOutlineAssignment,
  MdOutlineLogout,
  MdOutlineUploadFile,
} from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { HiMenu, HiOutlineChevronDoubleLeft } from "react-icons/hi";
import { FaRegEdit } from "react-icons/fa";
import { IoAddSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Icons = {
  QuestionMark: RxQuestionMarkCircled,
  Delete: MdDelete,
  CreateNewInstance: MdCreateNewFolder,
  ViewAssignment: MdOutlineAssignment,
  ViewSubmissions: MdOutlineUploadFile,
  Logout: MdOutlineLogout,
  Collapse: HiOutlineChevronDoubleLeft,
  Expand: HiMenu,
  Edit: FaRegEdit,
  Add: IoAddSharp,
  Cross: RxCross2,
};

export default Icons;
