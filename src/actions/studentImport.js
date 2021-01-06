

export const changeStudentImportTable = ({ academyId, level, academyName }) => {
  return { type: 'set_studentImport_state', payload: { academyId, level, academyName } }
}
