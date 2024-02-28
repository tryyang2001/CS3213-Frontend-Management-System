import { Avatar } from "@nextui-org/react"
import { ReactNode } from "react"

export type UserInfo = {
    name: string,
    email: string,
    bio?: string,
    photo?: string
}

const Card = ({children} : {children: ReactNode}) => {
    return <div className="flex items-center gap-4">
            {children}
        </div>
}

/** ReadOnly Profile Picture, Name and Email */
export const ReadOnlyFullUserCard = ({userInfo}: {userInfo: UserInfo}) => {
    return <Card>
            <Avatar 
                showFallback
                src={userInfo.photo} 
                className="w-20 h-20 text-large" />
            <div>
                <p>{userInfo.name}</p>
                <p className="text-xs">{userInfo.email}</p>
            </div>
    </Card>
}

/** ReadOnly Profile Picture and Name */
export const ReadOnlyUserCard = ({userInfo}: {userInfo: UserInfo}) => {
    return <Card>
            <Avatar 
                showFallback
                src={userInfo.photo} 
                className="w-20 h-20 text-large" />
            <div>
                <p className="text-large">{userInfo.name}</p>
            </div>
    </Card>
}