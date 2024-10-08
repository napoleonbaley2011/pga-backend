import { Dialog, DialogTitle, DialogContent, Table, TableHead, TableBody, TableRow, TableCell, Typography, Divider, DialogActions, Button } from "@mui/material";

interface ViewProps {
    open: boolean;
    handleClose: () => void;
    item: any | null;
}

export const ViewNote = (props: ViewProps) => {
    const { open, handleClose, item } = props;
    const getTypeTextAndColor = (typeId: number) => {
        switch (typeId) {
            case 1:
                return { text: "Almacen", color: '#1976d2' };
            case 2:
                return { text: "Caja chica", color: '#388e3c' };
            case 3:
                return { text: "Fondo de avance", color: '#fbc02d' };
            default:
                return { text: "Desconocido", color: '#000000' };
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#E2F6F0', color: '#333', padding: '16px' }}>
                Visualizar Nota de Entrada
            </DialogTitle>
            <DialogContent sx={{ padding: '24px' }}>
                {item && (
                    <div>
                        <Table size="small" sx={{ marginBottom: 2 }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Número de Nota:</TableCell>
                                    <TableCell>{item.number_note}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Número de Factura:</TableCell>
                                    <TableCell>{item.invoice_number}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Nombre del proveedor:</TableCell>
                                    <TableCell>{item.name_supplier}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha de Ingreso:</TableCell>
                                    <TableCell>{item.delivery_date}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Autorización de Factura:</TableCell>
                                    <TableCell>{item.invoice_auth}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo de Nota de Entrada:</TableCell>
                                    <TableCell>
                                        <Typography variant="body1" sx={{ color: getTypeTextAndColor(item.type_id).color }}>
                                            {getTypeTextAndColor(item.type_id).text}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <Divider sx={{ my: 2, borderBottom: '2px solid #E2F6F0' }} />

                        <Typography variant="h6" sx={{ mb: 2 }}>Visualizar Materiales</Typography>
                        <Table size="small" sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                            <TableHead sx={{ backgroundColor: '#E2F6F0' }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#555' }}>Código</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#555' }}>Descripción</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#555' }}>Unidad</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#555' }}>Cantidad</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#555' }}>Costo Unitario</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', color: '#555' }}>Costo Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {item.materials.map((material: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{material.code_material}</TableCell>
                                        <TableCell align="left" >{material.pivot?.name_material}</TableCell>
                                        <TableCell align="center" >{material.unit_material}</TableCell>
                                        <TableCell align="center" >{material.pivot?.amount_entries}</TableCell>
                                        <TableCell align="right" >{material.pivot?.cost_unit}</TableCell>
                                        <TableCell align="right" >{material.pivot?.cost_total}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
            <DialogActions sx={{ padding: '16px' }}>
                <Button onClick={handleClose} variant="outlined" color="primary">Cerrar</Button>
            </DialogActions>
        </Dialog>
    );
};
