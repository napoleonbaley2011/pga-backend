import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from "@mui/material";
import { FormEvent, useState } from "react";
import { useForm, useSupplierStore } from "../../../hooks";
import { ComponentInput } from "../../../components";
import { SupplierModel, FormSupplierModel, formSupplierValidations } from "../../../models";

interface createSupplierProps {
    open: boolean;
    handleClose: () => void;
    supplier: SupplierModel | null;
};

const formFields: FormSupplierModel = {
    name: '',
    nit: '',
    cellphone: '',
    sales_representative: '',
    address: '',
    email: ''
};

const formValidation: formSupplierValidations = {
    name: [(value: string | null) => value == null ? false : value.length > 1, 'Debes ingresar el nombre del proveedor'],
    nit: [(value: string | null) => value == null ? false : value.length > 1, 'Debes ingresar el nombre del proveedor'],
    cellphone: [(value: string | null) => value == null ? false : value.length > 1, 'Debes ingresar el nombre del proveedor'],
    sales_representative: [(value: string | null) => value == null ? false : value.length > 1, 'Debes ingresar el nombre del proveedor'],
    address: [(value: string | null) => value == null ? false : value.length > 1, 'Debes ingresar el nombre del proveedor'],
    email: [(value: string | null) => value == null ? false : value.length > 1, 'Debes ingresar el nombre del proveedor']
};

export const CreateSupplier = (props: createSupplierProps) => {
    const { open, handleClose, supplier } = props;
    const { postSupllier, patchUpdateSupplier } = useSupplierStore();
    const [loading, setLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const {
        name, nit, cellphone, sales_representative, address, email,
        onInputChange, isFormValid, onResetForm,
        nameValid, addressValid
    } = useForm(supplier ?? formFields, formValidation);

    const sendSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormSubmitted(true);
        if (!isFormValid) return;
        let data = { name, nit, cellphone, sales_representative, address, email };
        setLoading(true);
        if (supplier == null) {
            await postSupllier(data).then((res) => {
                if (res) {
                    handleClose();
                    onResetForm();
                }
            });
        } else {
            await patchUpdateSupplier(supplier.id, data).then((res) => {
                if (res) {
                    handleClose();
                    onResetForm();
                }
            });
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{supplier == null ? 'Nuevo Proveedor' : `${supplier.name}`}</DialogTitle>
            <form onSubmit={sendSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ComponentInput
                                type="text"
                                label="Nombre"
                                name="name"
                                value={name}
                                onChange={(V: any) => onInputChange(V, false, false)}
                                helperText={formSubmitted ? nameValid : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ComponentInput
                                type="text"
                                label="Representante"
                                name="sales_representative"
                                value={sales_representative}
                                onChange={(V: any) => onInputChange(V, false, false)}
                                helperText={formSubmitted ? nameValid : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ComponentInput
                                type="text"
                                label="Direccion"
                                name="address"
                                value={address}
                                onChange={(V: any) => onInputChange(V, false, false)}
                                helperText={formSubmitted ? addressValid : ''}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ComponentInput
                                type="text"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(V: any) => onInputChange(V, false, false)}
                                helperText={formSubmitted ? addressValid : ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ComponentInput
                                type="text"
                                label="NIT"
                                name="nit"
                                value={nit}
                                onChange={(V: any) => onInputChange(V, false, false)}
                                helperText={formSubmitted ? nameValid : ''}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <ComponentInput
                                type="text"
                                label="Celular / Telefono"
                                name="cellphone"
                                value={cellphone}
                                onChange={(V: any) => onInputChange(V, false, false)}
                                helperText={formSubmitted ? nameValid : ''}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {loading ? (
                        <CircularProgress color="success" size={30} />
                    ) : (
                        <>
                            <Button onClick={handleClose}>CANCELAR</Button>
                            <Button type="submit">{supplier == null ? 'CREAR' : 'GUARDAR'}</Button>
                        </>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};
