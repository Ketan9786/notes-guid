import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import palette from "../theme/Theme.jsx";

const CommonTable = ({ columns = [], rows = [] }) => {
  return (
    <TableContainer
      sx={{
        mb: 2,
        borderRadius: 2,
        border: `1px solid ${palette.border}`,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: palette.navyRaised }}>
            {columns.map((column) => (
              <TableCell
                key={column}
                sx={{
                  color: palette.gold,
                  fontWeight: 700,
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                "&:nth-of-type(even)": {
                  bgcolor: "rgba(255,255,255,0.025)",
                },
                "& .MuiTableCell-root": {
                  color: palette.text,
                  borderColor: palette.border,
                },
              }}
            >
              {columns.map((column) => (
                <TableCell key={column}>
                  {row[column] || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CommonTable;