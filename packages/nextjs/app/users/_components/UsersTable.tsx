import { Address } from "~~/components/scaffold-eth";
import { User } from "~~/types/commontypes";

const UsersTable = ({ users, onRowClick }: { users: User[]; onRowClick: (string: string) => void }) => {
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">User Address</th>
              <th className="bg-primary">User Name</th>
              <th className="bg-primary">No of Skills</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr
                key={user.address}
                onClick={() => onRowClick(user.address)}
                className="hover text-sm cursor-pointer text-center"
              >
                <td className="w-2/12 md:py-4">
                  <Address address={user.address} size="sm" />
                </td>
                <td className="w-2/12 md:py-4">{user.name}</td>
                <td className="w-2/12 md:py-4">{user.skills.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { UsersTable };
