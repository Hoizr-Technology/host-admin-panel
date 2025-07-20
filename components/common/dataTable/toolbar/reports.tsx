import useGlobalStore from "@/store/global";
import { Table } from "@tanstack/react-table";
import { download, generateCsv, mkConfig } from "export-to-csv";
import { MdOutlineFileDownload } from "react-icons/md";
import CButton from "../../buttons/button";
import { ButtonType } from "../../buttons/interface";

interface ReportsDataTableToolbarProps<TData> {
  table: Table<TData>;
  tableTitle: string;
  manual: boolean;

  fileName?: string;
  downloadDisabled?: boolean;
}

const ReportsDataTableToolbar = <TData,>(
  props: ReportsDataTableToolbarProps<TData>
) => {
  const { setToastData } = useGlobalStore();
  const {
    // Table Configs
    table,
    tableTitle,

    // Export Button
    downloadDisabled,
    fileName,
  } = props;

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
    filename: fileName,
  });

  return (
    <div className="flex items-center justify-between p-4 w-full border-b">
      <h2>{tableTitle}</h2>
      <div className="flex items-center justify-center space-x-3">
        {/* Export CSV */}
        <CButton
          variant={ButtonType.Outlined}
          className=""
          disabled={downloadDisabled}
          onClick={async () => {
            let d = table.getFilteredRowModel().rows;

            if (d.length <= 0) {
              setToastData({
                type: "warning",
                message:
                  "There are no row(s) available to download, please try again.",
              });
              return;
            }

            // Converts your Array<Object> to a CsvOutput string based on the configs
            const csv = generateCsv(csvConfig)(d.map((e) => e.original) as any);

            download(csvConfig)(csv);
          }}
        >
          <MdOutlineFileDownload size={18} />
        </CButton>
      </div>
    </div>
  );
};

export default ReportsDataTableToolbar;
