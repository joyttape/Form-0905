import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';
import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';

const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .required('Informe seu nome completo')
    .matches(/^[a-zA-ZÀ-ÿ\s']+$/, 'Nome deve conter apenas letras'),
  cep: Yup.string()
    .required('Informe o CEP')
    .test('cep', 'CEP inválido', (value) => {
      const unmasked = value?.replace(/\D/g, '');
      return unmasked?.length === 8;
    }),
  cpf: Yup.string()
    .required('Informe o CPF')
    .test('cpf', 'CPF inválido', (value) => {
      const unmasked = value?.replace(/\D/g, '');
      return unmasked?.length === 11;
    }),
  telefone: Yup.string()
    .required('Informe o telefone')
    .test('telefone', 'Telefone inválido', (value) => {
      const unmasked = value?.replace(/\D/g, '');
      return unmasked?.length >= 10 && unmasked?.length <= 11;
    }),
  email: Yup.string()
    .email('E-mail inválido')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'E-mail inválido')
    .required('Informe o e-mail'),
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

  const handleSubmitForm = (values, actions) => {
    const { senha, ...safeValues } = values;
    console.log('Dados do formulário (senha omitida):', safeValues);
  
    setTimeout(() => {
      alert('Formulário enviado com sucesso!');
      actions.setSubmitting(false);
    }, 1500);
  };

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
          onSubmit={handleSubmitForm}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isValid, isSubmitting }) => (
            <View>
              <Text style={styles.titulo}>Formulário</Text>

              {[
                { label: 'Nome Completo', field: 'nome', type: 'default', autoCapitalize: 'words' },
                { label: 'E-mail', field: 'email', type: 'email-address', autoCapitalize: 'none' },
                { label: 'Senha', field: 'senha', type: 'password', autoCapitalize: 'none' },
              ].map(({ label, field, type, autoCapitalize }) => (
                <View key={field}>
                  <Text style={styles.texto}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    secureTextEntry={type === 'password'}
                    keyboardType={type === 'email-address' ? 'email-address' : 'default'}
                    onChangeText={handleChange(field)}
                    onBlur={handleBlur(field)}
                    value={values[field]}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
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
                onBlur={handleBlur('cep')}
                keyboardType="numeric"
                accessibilityLabel="Campo CEP"
              />
              {touched.cep && errors.cep && <Text style={styles.error}>{errors.cep}</Text>}

              <Text style={styles.texto}>CPF</Text>
              <TextInputMask
                type={'cpf'}
                style={styles.input}
                value={values.cpf}
                onChangeText={(text) => setFieldValue('cpf', text)}
                onBlur={handleBlur('cpf')}
                keyboardType="numeric"
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
                onBlur={handleBlur('telefone')}
                keyboardType="phone-pad"
                accessibilityLabel="Campo Telefone"
              />
              {touched.telefone && errors.telefone && <Text style={styles.error}>{errors.telefone}</Text>}

              <TouchableOpacity
                onPress={handleSubmit}
                style={[styles.botao, (!isValid || isSubmitting) && styles.botaoDisabled]}
                disabled={!isValid || isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Botão enviar"
                accessibilityState={{ disabled: !isValid || isSubmitting }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.botaoTexto}>Enviar</Text>
                )}
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
    paddingHorizontal: 20,
  },
  form: {
    marginTop: 20,
    padding: 20
  },
  titulo: {
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    alignSelf: 'center',
    paddingBottom: 20,
    color: '#5941F2',
  },
  texto: {
    fontSize: 15,
    paddingBottom: 8,
    fontFamily: 'Montserrat_700Bold',
    color: '#705CF2',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontFamily: 'Montserrat_400Regular',
    backgroundColor: '#FAFAFA',
  },
  error: {
    color: '#FF6B6B',
    marginBottom: 10,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
  },
  botao: {
    marginTop: 30,
    borderRadius: 8,
    backgroundColor: '#04D94F',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDisabled: {
    backgroundColor: '#AAA',
  },
  botaoTexto: {
    color: '#fff',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});
