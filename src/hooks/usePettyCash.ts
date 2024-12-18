import { useDispatch, useSelector } from "react-redux";
import { coffeApi } from "../services";
import { setPettyCash, setProduct, refreshPettyCash } from "../store";
import { downloadDocument, printDocument } from "../utils/helper";
import Swal from "sweetalert2";
const api = coffeApi;

export const usePettyCash = () => {
    const { petty_cashes, products, flag } = useSelector((state: any) => state.petty_cashes);
    const dispatch = useDispatch();

    const getDataPettyCash = async () => {
        try {
            const { data } = await api.get('/auth/DatesPettyCash')
            dispatch(setPettyCash({ petty_cashes: data }))
        } catch (error: any) {
            if (error.response && error.response.status == 400) {
                const message = error.response.data.error
                Swal.fire('Error', message, 'error')
            } else if (error.response && error.response.status == 403) {
                const message = error.response.data.detail
                Swal.fire('Acceso denegado', message, 'warning')
            } else throw new Error('Ocurrió algun error en el backend')
        }
    }

    const getProductsData = async () => {
        try {
            const { data } = await api.get('/auth/printAccountabilitySheet')
            dispatch(setProduct({ products: data }))
        } catch (error: any) {
            if (error.response && error.response.status == 400) {
                const message = error.response.data.error
                Swal.fire('Error', message, 'error')
            } else if (error.response && error.response.status == 403) {
                const message = error.response.data.detail
                Swal.fire('Acceso denegado', message, 'warning')
            } else throw new Error('Ocurrió algun error en el backend')
        }
    }

    const PrintDiaryBook = async (action: string) => {
        if (action == 'libroDiario') {
            try {
                const response = await api.get(`/auth/PrintRecordBook/`, {
                    responseType: 'arraybuffer'
                });
                printDocument(response);
                return true;
            } catch (error) {
                console.error('Error al imprimir la nota ', error);
            }
        } else {
            try {
                const response = await api.get(`/auth/AccountabilitySheet/`, {
                    responseType: 'arraybuffer'
                });
                printDocument(response);
                return true;
            } catch (error) {
                console.error('Error al imprimir la nota ', error);
            }
        }
    }

    const DownloadDiaryBook = async (action: string) => {
        if (action == 'libroDiario') {
            try {
                const response = await api.get(`/auth/PrintRecordBook/`, {
                    responseType: 'arraybuffer'
                });
                downloadDocument(response, 'Libro_Diario.pdf');
                return true;
            } catch (error) {
                console.error('Error al imprimir la nota ', error);
            }
        } else {
            try {
                const response = await api.get(`/auth/AccountabilitySheet/`, {
                    responseType: 'arraybuffer'
                });
                downloadDocument(response, 'Planilla_de_Descargos.pdf');
                return true;
            } catch (error) {
                console.error('Error al imprimir la nota ', error);
            }
        }
    }

    const PaymentOrder = async (total: number, responsible: string) => {
        try {
            const params = new URLSearchParams({
                total: total.toString(),
                responsible,
            });


            const response = await api.get(`/auth/paymentOrder?${params.toString()}`, {
                responseType: 'arraybuffer'
            });
            Swal.fire('Éxito', 'Orden de pago enviada correctamente', 'success');
            downloadDocument(response, 'Orden_de_pago.pdf');
            return true;


            // const { data } = await api.get(`/auth/paymentOrder?${params.toString()}`);
            // Swal.fire('Éxito', 'Orden de pago enviada correctamente', 'success');

        } catch (error: any) {
            if (error.response && error.response.status == 400) {
                const message = error.response.data.error;
                Swal.fire('Error', message, 'error');
            } else if (error.response && error.response.status == 403) {
                const message = error.response.data.detail;
                Swal.fire('Acceso denegado', message, 'warning');
            } else {
                console.error('Error al enviar la orden de pago:', error);
                throw new Error('Ocurrió algún error en el backend');
            }
        }
    }

    return {
        petty_cashes,
        flag,
        products,

        getDataPettyCash,
        getProductsData,
        PrintDiaryBook,
        DownloadDiaryBook,
        PaymentOrder,
    }
}