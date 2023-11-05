import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    ListRenderItem,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { createTodo, deleteTodo, getTodos, Todos, updateTodo } from "../api/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
export default function IndexScreen() {
    const queryClient = useQueryClient();
    const [todo, setTodo] = useState("");
    const todosQuery = useQuery({
        queryKey: ['todos'],
        queryFn: getTodos
    })
    const updateQueryClient = (updatedTodo: Todos) => {
        queryClient.setQueryData(['todos'], (data: any) => {
            return data.map((todo: Todos) => (todo.id === updatedTodo.id ? updatedTodo : todo))
        })
    }
    const addMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        }
    })
    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] })
        }
    })
    const updateMutation = useMutation({
        mutationFn: updateTodo,
        onSuccess: updateQueryClient,
    })
    const addTodo = () => {
        addMutation.mutate(todo);
    }
    const renderTodo: ListRenderItem<Todos> = ({ item }) => {
        const deleteTodo = () => {
            deleteMutation.mutate(item.id);
        }
        const toggleDone = () => {
            updateMutation.mutate({ ...item, done: !item.done })
        }
        return (
            <View style={styles.todoContainer} >
                <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                    {item.done && <View style={styles.done} />}
                    {!item.done && <View style={styles.notDone} />}
                    <Text style={styles.todoText}>{item.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={deleteTodo}>
                    <Text style={styles.delete}>X</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput placeholder='Add todo' onChangeText={setTodo} value={todo} style={styles.input} />
                <Button title='Add' onPress={addTodo} />
            </View>
            {todosQuery.isLoading && <ActivityIndicator size={'large'} />}
            {todosQuery.isError && <Text>There is an error </Text>}
            <FlatList data={todosQuery.data} renderItem={renderTodo} keyExtractor={(item) => item.id.toString()} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    form: {
        flexDirection: 'row',
        marginVertical: 20,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: '#fff'
    },
    todoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        gap: 10,
        marginVertical: 4,
        backgroundColor: '#fff'
    },
    todo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoText: {
        paddingHorizontal: 10,
    },
    delete: {
        fontSize: 20,
        color: "red"
    },
    done: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'green'
    },
    notDone: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white'
    }
})