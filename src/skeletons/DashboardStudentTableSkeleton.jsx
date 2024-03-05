import Skeleton from "react-loading-skeleton";
import styles from "@/assets/css/dashboard.module.css";

const DashboardStudentTableSkeleton = ({ rows }) => {
  return (
    <>
      {Array(rows)
        .fill(0)
        .map((_, index) => (
          <tr key={index} className="align-middle">
            <td className="text-center">
              <Skeleton height={20} width={20} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={80} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={70} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={80} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={80} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={80} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={80} />
            </td>
            <td className="text-center">
              <Skeleton height={20} width={80} />
            </td>
            <td className='text-center'>
              <button className={`${styles.deleteBtn}`} disabled>
                Delete
              </button>
            </td>
          </tr>
        ))}
    </>
  );
};

export default DashboardStudentTableSkeleton;
