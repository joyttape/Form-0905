import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const validationSchema = Yup.object().shape({
  nome: Yup.string().required('Informe seu nome completo'),
  cep: Yup.string().required('Informe o CEP').length(9, 'CEP inválido'),
  cpf: Yup.string().required('Informe o CPF').length(14, 'CPF inválido'),
  telefone: Yup.string().required('Informe o telefone').min(14, 'Telefone inválido'),
  email: Yup.string().email('E-mail inválido').required('Informe o e-mail'),
  senha: Yup.string()
    .required('Informe a senha')
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      'A senha deve conter letra minúscula, maiúscula, número e caractere especial. Sem acentos ou ç.'
    )
    .test(
      'no-acento-ou-cedilha',
      'A senha não pode conter acentos ou "ç"',
      (value) => !/[çáàãâéêíóôõúü]/i.test(value || '')
    ),
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5941F2" />
        <Text style={{ fontSize: 16, marginTop: 10 }}>Carregando fontes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Formik
          initialValues={{
            nome: '',
            cep: '',
            cpf: '',
            telefone: '',
            email: '',
            senha: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => {
            alert('Formulário enviado com sucesso!');
            console.log(values);
            actions.setSubmitting(false);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid, isSubmitting }) => (
            <View>
              <Text style={styles.titulo}>Formulário</Text>

              {[
                { label: 'Nome Completo', field: 'nome', type: 'text' },
                { label: 'E-mail', field: 'email', type: 'email-address' },
                { label: 'Senha', field: 'senha', type: 'password' },
              ].map(({ label, field, type }) => (
                <View key={field}>
                  <Text style={styles.texto}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={type === 'password'}
                    keyboardType={type === 'email-address' ? 'email-address' : 'default'}
                    onChangeText={handleChange(field)}
                    onBlur={handleBlur(field)}
                    value={values[field]}
                    accessibilityLabel={`Campo ${label}`}
                  />
                  {touched[field] && errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
                </View>
              ))}

              <Text style={styles.texto}>CEP</Text>
              <TextInputMask
                type={'zip-code'}
                style={styles.input}
                value={values.cep}
                onChangeText={(text) => setFieldValue('cep', text)}
                accessibilityLabel="Campo CEP"
              />
              {touched.cep && errors.cep && <Text style={styles.error}>{errors.cep}</Text>}

              <Text style={styles.texto}>CPF</Text>
              <TextInputMask
                type={'cpf'}
                style={styles.input}
                value={values.cpf}
                onChangeText={(text) => setFieldValue('cpf', text)}
                accessibilityLabel="Campo CPF"
              />
              {touched.cpf && errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}

              <Text style={styles.texto}>Telefone celular (com DDD)</Text>
              <TextInputMask
                type={'cel-phone'}
                options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
                style={styles.input}
                value={values.telefone}
                onChangeText={(text) => setFieldValue('telefone', text)}
                accessibilityLabel="Campo Telefone"
              />
              {touched.telefone && errors.telefone && <Text style={styles.error}>{errors.telefone}</Text>}

              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.botao, (!isValid || isSubmitting) && { backgroundColor: '#AAA' }]}
                disabled={!isValid || isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Botão enviar"
              >
                <Text style={styles.botaoTexto}>{isSubmitting ? 'Enviando...' : 'Enviar'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
  },
  form: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
  },
  titulo: {
    fontSize: 21,
    fontFamily: 'Montserrat_700Bold',
    alignSelf: 'center',
    paddingBottom: 10,
    color: '#5941F2',
  },
  texto: {
    fontSize: 15,
    paddingBottom: 10,
    fontFamily: 'Montserrat_700Bold',
    color: '#705CF2',
  },
  input: {
    width: 300,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    height: 40,
    fontFamily: 'Montserrat_400Regular',
  },
  error: {
    color: '#976DF2',
    marginBottom: 5,
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center',
    fontFamily: 'Montserrat_400Regular',
  },
  botao: {
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: '#04D94F',
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  botaoTexto: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
