import { FormEvent, useCallback, useEffect, useState } from "react";
import { FormMaterialModel, GroupModel, MaterialModel, FormMaterialValidate } from "../../../../models";
import { useForm, useMaterialStore } from "../../../../hooks";
import { ComponentInput, ComponentInputSelect, ModalSelectComponent } from "../../../../components";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { GroupModal } from "../../Groups";

interface createProps {
    open: boolean;
    handleClose: () => void;
    item: MaterialModel | null;
    type_material_select_base: string;
}

const formMaterialFields: FormMaterialModel = {
    group_id: null,
    code_material: '',
    description: '',
    unit_material: '',
    barcode: '',
}

const formMaterialValidation: FormMaterialValidate = {
    group_id: [(value: GroupModel) => value !== null, 'Debe pertenecer a un Grupo'],
    code_material: [(value: string | null) => value == null, 'Debe ingresar el codigo correspondiente del material'],
    description: [(value: string | null) => value == null, 'Debe ingresar la descripcion del material'],
    unit_material: [(value: string | null) => value == null, 'Debe ingresar la unidad del material'],
    barcode: [(value: string | null) => value == null, 'Debe ingresar la codigo de barra del material']
}

export const CreateMaterials = (props: createProps) => {
    const { open, handleClose, item, type_material_select_base } = props
    const { postMaterial } = useMaterialStore();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const { group_id, code_material, description, unit_material, barcode,
        onInputChange, onValueChange, onResetForm,
        group_idValid } = useForm(item ?? formMaterialFields, formMaterialValidation);

    const handleModal = useCallback((value: boolean) => setModal(value), []);

    const sendSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormSubmitted(true);
        let data: { group_id: number, code_material?: string, description?: string, unit_material?: string, barcode?: string, stock?: number, state?: string, min?: number, type?: string } = {
            group_id: group_id.id
        }
        data.code_material = code_material;
        data.description = description;
        data.unit_material = unit_material;
        data.barcode = barcode;
        data.stock = 0;
        data.state = "Inhabilitado"
        data.min = 5;
        data.type = type_material_select_base;
        setLoading(true);
        if (item == null) {
            await postMaterial(data).then((res) => {
                if (res) {
                    handleClose();
                    onResetForm();
                }
            });
        }
        setLoading(false);
    }

    useEffect(() => {
        const handleResize = () => {
            // Aquí podrías usar screenHeight si fuera necesario
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const units = [
        "HOJAS",
        "ROLLO",
        "BLOCK",
        "CAJA",
        "PIEZAS",
        "OVILLO",
        "GLOBAL",
        "PAQUETE",
        "RESMA"
    ];

    const type_material_select = [
        "Almacen", "Caja Chica", "Fondo en Avance"
    ];
    units.sort((a, b) => a.localeCompare(b));

    return (
        <>
            {
                modal ?
                    <ModalSelectComponent
                        stateSelect={true}
                        stateMultiple={false}
                        title='Seleccione el grupo del nuevo material'
                        opendrawer={modal}
                        handleDrawer={handleModal}
                    >
                        <GroupModal
                            stateSelect={true}
                            limitInit={5}
                            itemSelect={(v) => {
                                onValueChange('group_id', v);
                                handleModal(false)
                            }}
                        />
                    </ModalSelectComponent> :
                    <></>
            }
            <Dialog open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle>Nuevo Material</DialogTitle>
                <form onSubmit={sendSubmit}>
                    <DialogContent>
                        <Grid container>
                            <Grid item xs={12} sm={12} sx={{ padding: '5px' }}>
                                <ComponentInputSelect
                                    label={group_id != null ? "Grupos" : ''}
                                    title={group_id != null ? group_id.name_group : "Seleccionar Grupo"}
                                    onPressed={() => handleModal(true)}
                                    error={!!group_idValid && formSubmitted}
                                    helperText={formSubmitted ? group_idValid : ''}
                                />
                            </Grid>
                            {
                                group_id && (
                                    <>
                                        <Stack direction="row" justifyContent="center">
                                            <Typography></Typography>
                                            <Typography>Agregar los datos del nuevo material</Typography>
                                        </Stack>
                                        <Stack direction="row">
                                            <Grid item xs={12} sm={6} sx={{ padding: '5px' }}>
                                                <ComponentInput
                                                    type="number"
                                                    label="Codigo"
                                                    name="code_material"
                                                    value={code_material}
                                                    onChange={(V: any) => onInputChange(V, false, false)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6} sx={{ padding: '5px' }}>
                                                <ComponentInput
                                                    type="text"
                                                    label="Codigo de Barra"
                                                    name="barcode"
                                                    value={barcode}
                                                    onChange={(V: any) => onInputChange(V, false, false)}
                                                />
                                            </Grid>
                                        </Stack>

                                        <Grid container spacing={2}>

                                            <Grid item xs={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Tipo de material</InputLabel>
                                                    <Select
                                                        label="Tipo de Material"
                                                        name="type_material"
                                                        value={type_material_select_base}
                                                        onChange={(V: any) => onInputChange(V, false, false)}
                                                    >
                                                        {type_material_select.map((unit, index) => (
                                                            <MenuItem key={index} value={unit}>
                                                                {unit}
                                                            </MenuItem>
                                                        ))}

                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <FormControl fullWidth>
                                                    <InputLabel>Unidad</InputLabel>
                                                    <Select
                                                        label="Unidad"
                                                        name="unit_material"
                                                        value={unit_material}
                                                        onChange={(V: any) => onInputChange(V, false, false)}
                                                    >
                                                        {units.map((unit, index) => (
                                                            <MenuItem key={index} value={unit}>
                                                                {unit}
                                                            </MenuItem>
                                                        ))}

                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12} sm={12} sx={{ padding: '5px' }}>
                                            <ComponentInput
                                                type="text"
                                                label="Nombre del Material"
                                                name="description"
                                                value={description}
                                                onChange={(V: any) => onInputChange(V, false, false)}
                                            />
                                        </Grid>
                                    </>
                                )
                            }
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        {
                            loading ?
                                <CircularProgress color="success" size={30} /> :
                                <>
                                    <Button onClick={handleClose}>CANCELAR</Button>
                                    <Button type="submit">
                                        {item == null ? 'CREAR' : 'GUARDAR'}
                                    </Button>
                                </>
                        }
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
