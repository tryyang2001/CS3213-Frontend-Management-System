import { RxQuestionMarkCircled } from "react-icons/rx";
import {
  MdDelete,
  MdOutlineAssignment,
  MdOutlineLogout,
  MdOutlineUploadFile,
} from "react-icons/md";
import { MdCreateNewFolder } from "react-icons/md";
import { HiMenu, HiOutlineChevronDoubleLeft } from "react-icons/hi";

const Icons = {
  QuestionMark: RxQuestionMarkCircled,
  Delete: MdDelete,
  CreateNewInstance: MdCreateNewFolder,
  ViewAssignment: MdOutlineAssignment,
  ViewSubmissions: MdOutlineUploadFile,
  Logout: MdOutlineLogout,
  Collapse: HiOutlineChevronDoubleLeft,
  Expand: HiMenu,
};

export default Icons;
