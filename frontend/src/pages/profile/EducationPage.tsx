import React, { useEffect, useState } from 'react';
import { Container, Paper, Box, Typography, Grid, TextField, Button, CircularProgress } from '@mui/material';
import { getMyEducation, updateMyEducation } from '../../services/api';

const EducationPage: React.FC = () => {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getMyEducation();
        setForm(data || {});
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyEducation(form);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box p={4}>Loading...</Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Education Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="10+2 Marks (%)" name="pu_marks" value={form.pu_marks || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Stream" name="pu_stream" value={form.pu_stream || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Year" name="pu_year" value={form.pu_year || ''} onChange={handleChange} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Degree" name="degree_name" value={form.degree_name || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Marks (%)" name="degree_marks" value={form.degree_marks || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Year" name="degree_year" value={form.degree_year || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Specialization" name="specialization" value={form.specialization || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="University" name="university" value={form.university || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Additional Qualifications" name="additional_qualifications" value={form.additional_qualifications || ''} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Areas of Interest (comma separated)" name="areas_of_interest" value={form.areas_of_interest || ''} onChange={handleChange} />
          </Grid>
        </Grid>
        <Box mt={3} textAlign="right">
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EducationPage;


