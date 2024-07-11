import { Grid, Grow, IconButton, Paper, TextField, Typography, Box, Divider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useMaterialStore, useSupplierStore, useTypeStore } from "../../../hooks";
import { MaterialModel, SupplierModel, TypeModel } from "../../../models";
import { ComponentButton, SelectComponent } from "../../../components";
import { Delete } from "@mui/icons-material";
import { CreateSupplier } from "../Suppliers";
import { CreateMaterials } from "../Materials/createMaterial";

export const CreateNote = () => {
    const [formSubmited, setFormSubmited] = useState(false);
    const { types = [], getTypes } = useTypeStore();
    const { suppliers = [], getSuppliersList } = useSupplierStore();
    const { materials = [], getMaterial } = useMaterialStore();
    const [typeSelect, setTypeSelect] = useState<number>(0);
    const [supplierSelect, setSupplierSelect] = useState<number>(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogMaterial, setOpenDialogMaterial] = useState(false);
    const [selectedMaterials, setSelectedMaterials] = useState<{ id: number, name: string, quantity: number, price: number, unit_material: string }[]>([]);

    const handleType = (value: any) => {
        setTypeSelect(value);
    }

    const handleSupplier = (value: any) => {
        setSupplierSelect(value);
    }

    const handleDialog = useCallback((value: boolean) => {
        setOpenDialog(value);
    }, []);

    const handleDialogMaterial = useCallback((value: boolean) => {
        setOpenDialogMaterial(value);
    }, []);

    const handleAddMaterial = (value: any) => {
        const material = materials.find((material: MaterialModel) => material.id === value);
        if (material) {
            setSelectedMaterials([...selectedMaterials, { id: material.id, name: material.description, quantity: 1, price: 0, unit_material: material.unit_material }]);
        }
    }

    const handleQuantityChange = (id: number, quantity: number) => {
        setSelectedMaterials(selectedMaterials.map(material => material.id === id ? { ...material, quantity } : material));
    }

    const handlePriceChange = (id: number, price: number) => {
        setSelectedMaterials(selectedMaterials.map(material => material.id === id ? { ...material, price } : material));
    }

    const handleRemoveMaterial = (id: number) => {
        setSelectedMaterials(selectedMaterials.filter(material => material.id !== id));
    }

    const handleRemoveAllMaterials = () => {
        setSelectedMaterials([]);
    }

    const getTotal = () => {
        return selectedMaterials.reduce((acc, material) => acc + (material.quantity * material.price), 0);
    }

    useEffect(() => {
        getSuppliersList();
    }, []);

    useEffect(() => {
        getTypes();
    }, []);

    useEffect(() => {
        getMaterial(0, 10, '');
    }, []);

    const availableMaterials = materials.filter((material: MaterialModel) => !selectedMaterials.some(selected => selected.id === material.id));

    const isMaterialSelectDisabled = typeSelect === 0 || supplierSelect === 0;

    return (
        <>
            <Paper sx={{ margin: '10px 0px', padding: '10px', borderRadius: '10px', backgroundColor: '#d3f4eb' }}>
                <Typography variant="h6" style={{ textAlign: 'center', fontSize: '1rem' }}>Nueva Nota de Entrada</Typography>
                <Grow in={true} style={{ transformOrigin: '0 0 0' }} {...({ timeout: 2300 })}>
                    <form action="">
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={4}>
                                <SelectComponent
                                    handleSelect={handleType}
                                    label={"Tipo"}
                                    options={[{ id: 0, name: 'SIN TIPO' }, ...types.map((type: TypeModel) => ({ id: type.id, name: type.name_type }))]}
                                    value={typeSelect}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <SelectComponent
                                    handleSelect={handleSupplier}
                                    label={"Proveedor"}
                                    options={[{ id: 0, name: 'SIN PROVEDOR' }, ...suppliers.map((supplier: SupplierModel) => ({ id: supplier.id, name: supplier.name }))]}
                                    value={supplierSelect}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <ComponentButton
                                    text="Añadir Proveedor"
                                    onClick={() => handleDialog(true)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={1}>
                            <Grid item xs={12} sm={9}>
                                <SelectComponent
                                    handleSelect={handleAddMaterial}
                                    label={"Seleccionar Materiales"}
                                    options={[...availableMaterials.map((material: MaterialModel) => ({ id: material.id, name: material.description }))]}
                                    value={''}
                                    disabled={isMaterialSelectDisabled}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <ComponentButton
                                    text="Añadir Material"
                                    onClick={() => handleDialogMaterial(true)}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Grow>
            </Paper>
            <Paper sx={{ margin: '10px 0px', padding: '10px', borderRadius: '10px', backgroundColor: '#fffbe7' }}>
                <Typography variant="h6" style={{ textAlign: 'center', fontSize: '1rem' }}>Lista de Materiales</Typography>
                <Box sx={{ margin: '5px 0', padding: '5px', borderRadius: '5px', backgroundColor: '#e0e0e0' }}>
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={3}>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '0.875rem' }}>Material</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '0.875rem' }}>Cantidad</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '0.875rem' }}>Unidad</Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '0.875rem' }}>Precio</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '0.875rem' }}>Total</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography variant="subtitle1" fontWeight="bold" style={{ fontSize: '0.875rem' }}>Acciones</Typography>
                        </Grid>
                    </Grid>
                </Box>
                {selectedMaterials.map(material => (
                    <Box key={material.id} sx={{ margin: '5px 0', padding: '5px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>
                        <Grid container spacing={1} alignItems="center">
                            <Grid item xs={3}>
                                <Typography style={{ fontSize: '0.875rem' }}>{material.name}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    type="number"
                                    label="Cantidad"
                                    value={material.quantity}
                                    onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value))}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <Typography style={{ fontSize: '0.875rem' }}>{material.unit_material}</Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <TextField
                                    type="number"
                                    label="Precio"
                                    value={material.price}
                                    onChange={(e) => handlePriceChange(material.id, parseFloat(e.target.value))}
                                    fullWidth
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography style={{ fontSize: '0.875rem' }}>Total: {(material.quantity * material.price).toFixed(2)}</Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton onClick={() => handleRemoveMaterial(material.id)}>
                                    <Delete color="error" />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                <Divider sx={{ margin: '10px 0' }} />
                <Grid container justifyContent="space-between">
                    <Typography variant="h6" style={{ fontSize: '1rem' }}>Total General: {getTotal().toFixed(2)}</Typography>
                    <ComponentButton
                        text="Eliminar Todo"
                        onClick={handleRemoveAllMaterials}
                        startIcon={<Delete />}
                    />
                </Grid>
            </Paper>
            {openDialog && (
                <CreateSupplier
                    open={openDialog}
                    handleClose={() => handleDialog(false)}
                    supplier={null}
                />
            )}
            {openDialogMaterial && (
                <CreateMaterials
                    open={openDialogMaterial}
                    handleClose={() => handleDialogMaterial(false)}
                    item={null}
                />
            )}
        </>
    );
}
