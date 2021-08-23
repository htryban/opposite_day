import React from "react";
import {Grid, TextField} from "@material-ui/core";
import {Controller, useFormContext} from "react-hook-form";

const FormInput = ({name, label, required}) => {
	const {control} = useFormContext();

	return (
		<Grid item xs={12} sm={6}>
			<Controller
				defaultValue=""
				control={control}
				name={name}
				render={({field}) => (
					<TextField
						{...field}
						name={name}
						label={label}
						required={required}
						fullWidth
					/>
				)}/>
		</Grid>
	);
};

export default FormInput;
