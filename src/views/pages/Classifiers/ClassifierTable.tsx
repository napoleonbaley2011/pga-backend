import { useEffect } from "react"
import { ClassifierModel } from "../../../models"
import { Visibility, Edit } from "@mui/icons-material";
import { SvgIcon, Stack, Grid, IconButton, Typography, Box } from "@mui/material";
import { useClassifierStore } from "../../../hooks";
import { ItemPaper, SkeletonClassifier, SkeletonGroup } from "../../../components";
import noimage from "../../../assets/images/no-image.webp";
import carpeta from "../../../assets/images/carpeta.png";
import { GroupsTable } from "./Groups";
import { ComponentButton } from "../../../components";
import { useNavigate } from "react-router-dom";


interface tableProps {
    itemEdit?: (classifier: ClassifierModel) => void;
    stateSelect?: boolean;
    //itemSelect?:boolean;  //Recordar para los grupos en un classifier 
    items?: any[];
}


export const ClassifierTable = (props: tableProps) => {
    const { flag, classifiers = null, getClassifier } = useClassifierStore();
    const { itemEdit } = props;
    const navigate = useNavigate();


    const handleRederict = (id: number) => {
        navigate('/groupView', { state: { id_classifier: id } });
    }

    useEffect(() => {
        getClassifier();
    }, [flag]);

    return (
        <>
            {
                classifiers == null ? <SkeletonClassifier /> : classifiers.map((classifier: ClassifierModel) => {
                    return (
                        <ItemPaper key={classifier.id} elevation={5}>
                            <Grid container>
                                <Grid item xs={12} sm={3} sx={{ padding: '5px', textAlign: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>{classifier.code_class}</Typography>
                                    <Typography sx={{ fontWeight: 'bold' }}>{classifier.nombre}</Typography>
                                    <img
                                        src={carpeta}
                                        alt="Descripción de la imagen"
                                        style={{ height: '190px', width: '180px', objectFit: 'cover' }}
                                        onError={(e: any) => e.target.src = noimage}
                                    />
                                    <Box sx={{ textAlign: 'center' }} >
                                        <IconButton color="success" onClick={() => itemEdit!(classifier)}>
                                            <Edit />
                                        </IconButton>
                                        {/* <IconButton color="error" onClick={() => deleleClassifier(classifier)}>
                                            <Delete />
                                        </IconButton> */}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={9} sx={{ padding: '5px' }}>
                                    <Typography sx={{ fontWeight: 'bold' }}>Descripcion</Typography>
                                    <Typography sx={{ textAlign: 'justify' }}>{classifier.description}</Typography>
                                    {/*Aca deb ir la tabla de los grupos*/}
                                    {
                                        classifier.groups == null ? <SkeletonGroup /> : <GroupsTable groups={classifier.groups} />
                                    }
                                    <Stack direction="row" justifyContent="flex-end">
                                        <ComponentButton
                                            text="Ver grupos"
                                            onClick={() => handleRederict(classifier.id)}
                                            startIcon={<SvgIcon fontSize="small"><Visibility /></SvgIcon>}
                                        />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </ItemPaper>
                    );
                })
            }


        </>
    )
}