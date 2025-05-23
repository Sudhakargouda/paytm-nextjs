import { use, useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import Button from "./Button";

interface User {
  id: string | number;
  firstName: string;
  lastName: string;
}

export default function UserList() {
  const [user, setUser] = useState('')
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showUser, setShowUser] = useState<User[]>([]);
  const router = useRouter();

  const fetchAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/bulk');
      setAllUsers(response.data.users);
      setShowUser(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUser(value)

    const filterUsers = allUsers.filter((f) => f.firstName.toLowerCase().startsWith(value.toLowerCase()))
    setShowUser(filterUsers)
  }
  
  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div>
        <div className="mx-14">
        <input
        placeholder="search users..."
        value={user}
        onChange={handleInputChange}
        className="border-2 text-black border-gray-800 mt-2 px-2 py-1"
      />
        </div>

      <div className="mt-8 mx-14 space-y-2">
        {showUser.length > 0 ? (
          showUser.map((u) => (
            <div
              key={u.id}
              className="p-2 border border-gray-300 text-black rounded-md bg-gray-50 flex items-center justify-between"
            >
              <span className="text-sm font-medium">
                {u.firstName} {u.lastName} <span>userId = {u.id}</span>
              </span>

              <div className="pt-4">
                <Button
                  label="Send Money"
                  className="text-xs px-2 py-1"
                  onClick={() => router.push("/sendmoney")}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-600">No matching users found.</div>
        )}
      </div>
    </div>
  );
}
