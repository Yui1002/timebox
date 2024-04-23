import React, { useState } from 'react';
import {
    NativeBaseProvider,
    VStack,
    IconButton,
    CloseIcon,
    Text,
    Alert,
    HStack,
    useToast,
    Center,
    Button,
} from 'native-base';

const InputError = ({ error }: any) => {
    console.log('error content: ', error)
    const toast = useToast();

    return <Center>
        {toast.show({
            render: () => {
                return <Alert maxWidth="100%" alignSelf="center" flexDirection="row" status={error.type} variant='subtle'>
                    <VStack space={1} flexShrink={1} w="100%">
                        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                            <HStack space={2} flexShrink={1} alignItems="center">
                                <Alert.Icon />
                                {/* <Text fontSize="md" fontWeight="medium" flexShrink={1} color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}>
                            {title}
                          </Text> */}
                            </HStack>
                            <IconButton variant="unstyled" icon={<CloseIcon size="3" />} _icon={{
                                color: "lightText"
                            }} onPress={() => toast.closeAll()} />
                        </HStack>
                        {/* <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}> */}
                        {/* <Text px="6">{error.msg}</Text> */}
                    </VStack>
                </Alert>
            }
        })}
    </Center>;
};

// const InputError = ({msg}: any) => {
//     return (
//         <NativeBaseProvider>
//             <Alert w="100%" status='error'>
//                 <VStack space={2} flexShrink={1} w="100%">
//                     <HStack flexShrink={1} space={2} justifyContent="space-between">
//                         <HStack space={2} flexShrink={1}>
//                             <Alert.Icon mt="1" />
//                             <Text fontSize="md" color="coolGray.800">
//                                 {msg}
//                             </Text>
//                         </HStack>
//                         <IconButton variant="unstyled" _focus={{
//                             borderWidth: 0
//                         }} icon={<CloseIcon size="3" />} _icon={{
//                             color: "coolGray.600"
//                         }} />
//                     </HStack>
//                 </VStack>
//             </Alert>
//         </NativeBaseProvider>
//     );
// };

export default InputError;
